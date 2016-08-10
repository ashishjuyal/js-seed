import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HappyPack from 'happypack';

const assetPath = require('path').join(__dirname, 'dist');
const serverENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'local';
const resolve = {
  resolve: {
    extensions: ['', '.js', '.jsx'],
    unsafeCache: true
  },
};

const lintLoaders = {
  preLoaders: [{
    test: /\.js$/,
    exclude: [/node_modules/, 'mock/*', /coverage/, /dist/, 'target/'],
    loader: 'eslint'
  }]
};

const jsLoaders = {
  test: /\.js$/,
  exclude: [/node_modules/, /coverage/, /dist/, /scripts/, /target/, 'test/e2e/*'],
  loader: 'babel',
  happy: { id: 'js' },
  cacheDirectory: true
};

const plugins = {
  development: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html.tpl',
      inject: 'body'
    }),
    new HappyPack({ id: 'js' })
  ],
};

const development = {
  output: {
    path: assetPath,
    filename: 'main.js',
    publicPath: '/'
  },
  cache: true,
  debug: true,
  // devtool: 'cheap-module-eval-source-map',
  // devtool: 'source-map',
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './src/main.js',
  ],
  stats: {
    colors: true,
    reasons: true
  },
  ...resolve,
  noParse: [],
  module: {
    ...lintLoaders,
    loaders: [{
      ...jsLoaders,
      query: {
        plugins: [
          ["transform-decorators-legacy"],
          ['transform-object-rest-spread'],
          ['transform-class-properties'],
        ]
      }
    },
      ...loaders
    ]
  },

  plugins: plugins.development
};

export { development }
