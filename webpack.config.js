
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    mobile: path.join(__dirname, 'assets', 'scripts', 'mobile', 'app.js')
  },
  output: {
    path: path.join(__dirname, 'public', 'assets'),
    filename: '[name].bundle.js'
  },
  resolve: {
    root: [
      path.join(__dirname, 'bower_components'),
      path.join(__dirname, 'assets', 'scripts', 'mobile')
    ],
    alias: {
    }
  },
  plugins: [
    new webpack.ResolverPlugin([
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
    ])
  ]
};
