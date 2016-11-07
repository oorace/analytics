import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import sharedConfig from './webpack.config.shared.babel';
import { paths } from './config';

export default () => (config => ({
  ...config,
  devtool: 'source-map',
  entry: [
    `webpack-hot-middleware/client?path=${process.env.HOST}/__webpack_hmr`,
    ...config.entry
  ],
  output: {
    publicPath: `${process.env.HOST}/`,
    path: path.resolve(paths.tmpDir),
    devtoolModuleFilenameTemplate: '/[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '/[absolute-resource-path]?[hash]',
    ...config.output
  },
  plugins: [
    ...config.plugins,
    new HtmlWebpackPlugin({
      title: 'Analytics Project'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]

}))(sharedConfig());
