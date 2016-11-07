import devConfig from './webpack.config.dev.babel';
import { paths } from './config';

export default () => (config => ({
  ...config,
  output: {
    ...config.output,
    publicPath: '/'
  },
  devtool: 'inline-source-map',
  entry: [
    'webpack-hot-middleware/client',
    `mocha!./${paths.testDir}/index.js`
  ]
}))(devConfig());
