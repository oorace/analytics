import webpackConfig from './webpack.config.test.babel';
import { paths } from './config';

// Karma configuration here
module.exports = (config) => {
  const testEntry = `./${paths.testDir}/index.js`;
  const testWebpackConfig = webpackConfig();
  const conf = {
    exclude: [],
    files: [
      testEntry
    ],
    frameworks: [
      'sinon-chai',
      'sinon',
      'chai',
      'mocha'
    ],
    preprocessors: {
    },
    reporters: ['progress'],
    webpack: {
      module: testWebpackConfig.module,
      devtool: testWebpackConfig.devtool
    },
    webpackMiddleware: {
      stats: {
        colors: true,
        chunks: false

      },
      noInfo: true
    },
    plugins: [
      'karma-sinon-chai',
      'karma-sinon',
      'karma-chai',
      'karma-webpack',
      'karma-mocha',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-sourcemap-loader'
    ],
    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['PhantomJS'],
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    // concurrency level how many browser should be started simultaneously
    concurrency: 4,
    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 100000,
    browserNoActivityTimeout: 30000,
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  };
  conf.preprocessors[testEntry] = ['webpack', 'sourcemap'];
  config.set(conf);
};
