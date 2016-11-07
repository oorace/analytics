import path from 'path';
import webpack from 'webpack';
import sharedConfig from './webpack.config.shared.babel';
import { paths } from './config';

export default () => (config => ({
  ...config,
  output: {
    ...config.output,
    path: path.resolve(paths.distDir)
  },
  plugins: [
    ...config.plugins,
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
}))(sharedConfig());
