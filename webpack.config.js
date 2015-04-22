
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    mobile: path.join(__dirname, 'scripts', 'mobile', 'app.js')
  },
  output: {
    path: path.join(__dirname, 'public', 'assets'),
    filename: '[name].bundle.js'
  },
  resolve: {
    root: [
      path.join(__dirname, 'bower_components'),
      path.join(__dirname, 'scripts')
    ],
    alias: {
      'uri': 'uri.js/src/URI.js',
      'moment':'moment/min/moment-with-locales.js',
      'babel-polyfill': path.join(__dirname, 'node_modules', 'babel-core', 'browser-polyfill.js')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /bower_components/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.ResolverPlugin([
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
    ]),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
};
