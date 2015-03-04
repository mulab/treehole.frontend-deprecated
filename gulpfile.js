'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var rename = require("gulp-rename");
var path = require('path');
var webpack = require('webpack');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

function errorHandler(moduleName) {
  return function (err) {
    gutil.log('[' + moduleName + ']', err.message);
    this.emit('end');
  };
}

function webpackCallback(callback) {
  return function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }
    gutil.log('[webpack]', stats.toString({
      colors: true
    }));
    callback();
  };
}

gulp.task('build-stylesheets', function () {
  return gulp.src('./assets/stylesheets/mobile/index.less')
    .pipe(rename('mobile.bundle.less'))
    .pipe(plumber({ errorHandler: errorHandler('Less') }))
    .pipe(less({
      paths: [
        path.join(__dirname, 'assets', 'stylesheets', 'mobile'),
        path.join(__dirname, 'bower_components', 'onsenui', 'build', 'css')
      ]
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('build-scripts-dev', function (callback) {
  var config = require('./webpack.config');
  config.devtool = 'source-map';
  webpack(config, webpackCallback(callback));
});

gulp.task('build-scripts', function (callback) {
  var config = require('./webpack.config');
  config.plugins.push(new ngAnnotatePlugin({ add: true }));
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
  webpack(config, webpackCallback(callback));
});

gulp.task('build-assets-dev', ['build-stylesheets', 'build-scripts-dev']);

gulp.task('build-assets', ['build-stylesheets', 'build-scripts']);

gulp.task('watch', ['build-assets-dev'], function () {
  gulp.watch('./assets/**/*.less', ['build-stylesheets']);
  gulp.watch('./assets/**/*.js', ['build-scripts-dev']);
});
