 /* eslint-disable no-multi-str */
import childProcess from 'child_process';
import clean from 'gulp-clean';
import eslint from 'gulp-eslint';
import express from 'express';
import gulp from 'gulp';
import gutil from 'gulp-util';
import karma from 'karma';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import yargs from 'yargs';
import zip from 'gulp-zip';
import { paths, ports, tracker } from './config';
import webpackConfigDev from './webpack.config.dev.babel';
import webpackConfigTest from './webpack.config.test.babel';
import webpackConfigDist from './webpack.config.dist.babel';

const ansiblePlaybookVMCommandPrefix = 'ansible-playbook -u ubuntu \
  --private-key $VAGRANT_DOTFILE_PATH/machines/analytics/virtualbox/private_key \
  -i $VAGRANT_DOTFILE_PATH/provisioners/ansible/inventory/vagrant_ansible_inventory ansible/analytics.yml';

const buildDevServer = (name, port, webpackConfig) => {
  const compiler = webpack(webpackConfig);
  const app = express();

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    },
    noInfo: true
  }));

  app.use(webpackHotMiddleware(compiler));

  app.get('*', (req, res, next) => {
    next('route');
  });

  app.listen(port, (error) => {
    if (error) {
      throw new gutil.PluginError('webpack', error);
    } else {
      gutil.log(`Started ${name} on port ${port}.`);
    }
  });
};

gulp.task('lint', () =>
  gulp.src([
    `${paths.srcDir}/**/*.js`,
    `${paths.testDir}/**/*.js`,
    '*.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('clean', () =>
  gulp.src(paths.distDir)
    .pipe(clean())
);

gulp.task('set-host-env', () => {
  const argv = yargs.argv;
  process.env.HOST = argv.domain ? `https://${argv.domain}` : `http://localhost:${ports.devServer}`;
  process.env.COLLECTOR_HOST = argv.domain ? argv.domain : 'localhost';
});

gulp.task('set-dev-node-env', () => {
  process.env.NODE_ENV = 'development';
});

gulp.task('set-prod-node-env', () => {
  process.env.NODE_ENV = 'production';
});

gulp.task('webpack:dev', ['clean', 'set-dev-node-env', 'set-host-env'], () => {
  buildDevServer('dev server', ports.devServer, webpackConfigDev());
});

gulp.task('webpack:test', ['clean', 'set-dev-node-env', 'set-host-env'], () => {
  buildDevServer('test server', ports.testServer, webpackConfigTest());
});

gulp.task('webpack:dist', ['clean', 'set-prod-node-env', 'set-host-env'], (callback) => {
  webpack(webpackConfigDist(), (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      colors: true,
      chunks: false
    }));
    callback();
  });
});

gulp.task('zip:dist', ['webpack:dist'], () => gulp.src(`${paths.distDir}/${paths.bundleName}`)
  .pipe(zip('dist.zip'))
  .pipe(gulp.dest(paths.distDir)));

gulp.task('karma:test', ['set-host-env'], (callback) => {
  const argv = yargs.argv;
  new karma.Server({
    configFile: `${__dirname}/karma.conf.js`,
    singleRun: true,
    browsers: argv.browsers ? argv.browsers.split(',') : ['PhantomJS']
  }, callback).start();
});

gulp.task('test', ['karma:test']);

gulp.task('dist', ['zip:dist']);

gulp.task('dev', ['webpack:dev', 'webpack:test']);

gulp.task('default', ['dev']);

gulp.task('devmode', (callback) => {
  const proc = childProcess.exec(`${ansiblePlaybookVMCommandPrefix} -t nginx -e nginx_mode=dev`, callback);
  proc.stdout.on('data', data => gutil.log(data));
  proc.stderr.on('data', data => gutil.log(data));
});

gulp.task('intmode', (callback) => {
  const proc = childProcess.exec(`${ansiblePlaybookVMCommandPrefix} -t nginx`, callback);
  proc.stdout.on('data', data => gutil.log(data));
  proc.stderr.on('data', data => gutil.log(data));
});

gulp.task('playbook-tags', () => {
  const argv = yargs.argv;
  process.env.TAGS = argv.tags ? `-t ${argv.tags}` : '';
  process.env.SKIP_TAGS = argv['skip-tags'] ? `--skip-tags ${argv['skip-tags']}` : '';
});

gulp.task('prod:deploy', ['playbook-tags'], (callback) => {
  const proc = childProcess.exec(`ansible-playbook -u $USER --private-key ~/.ssh/id_rsa \
    -i ansible/inventory/production ansible/analytics.yml ${process.env.TAGS} ${process.env.SKIP_TAGS}`, callback);
  proc.stdout.on('data', data => gutil.log(data));
  proc.stderr.on('data', data => gutil.log(data));
});

gulp.task('dev:deploy', ['playbook-tags'], (callback) => {
  const proc = childProcess.exec(`${ansiblePlaybookVMCommandPrefix} ${process.env.TAGS} \
    ${process.env.SKIP_TAGS}`, callback);
  proc.stdout.on('data', data => gutil.log(data));
  proc.stderr.on('data', data => gutil.log(data));
});

gulp.task('config', () => {
  console.log(JSON.stringify({ // eslint-disable-line no-console
    paths,
    ports,
    tracker
  }));
});
