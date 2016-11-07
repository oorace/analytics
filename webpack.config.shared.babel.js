import webpack from 'webpack';
import { paths, tracker } from './config';

export default () => ({
  entry: [
    `./${paths.srcDir}/index`
  ],
  output: {
    filename: paths.bundleName
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      __DEV__: process.env.NODE_ENV !== 'production',
      'process.env.TRACKER_NAME': `"${tracker.trackerName}"`,
      'process.env.TRACKER_NAMESPACE': `"${tracker.trackerNamespace}"`,
      'process.env.TRACKER_APP_ID': `"${tracker.appId}"`,
      'process.env.TRACKER_COOKIE_DOMAIN': `"${tracker.cookieDomain}"`,
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
      'process.env.COLLECTOR_HOST': `"${process.env.COLLECTOR_HOST}"`
    })
  ],
  module: {
    preLoaders: [
      {
        test: new RegExp(`(${paths.srcDir}|${paths.testDir})/.*\\.js`),
        loader: 'eslint-loader',
        exclude: /(node_modules)/,
        include: __dirname
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        include: __dirname
      }
    ]
  }
});
