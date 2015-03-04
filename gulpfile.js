'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var path = require('path');
var webpack = require('webpack');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');

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
  return gulp.src('./assets/stylesheets/mobile.less')
    .pipe(plumber({
      errorHandler: function (err) {
        gutil.log('[Less]', err.message);
        this.emit('end');
      }
    }))
    .pipe(less({
      paths: [
        path.join(__dirname, 'assets', 'stylesheets'),
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
  // TODO
});

gulp.task('build-assets-dev', ['build-stylesheets', 'build-scripts-dev']);

gulp.task('build-assets', ['build-stylesheets', 'build-scripts']);

gulp.task('watch', ['build-assets-dev'], function () {
  gulp.watch('./assets/**/*.less', ['build-stylesheets']);
  gulp.watch('./assets/**/*.js', ['build-scripts-dev']);
});
