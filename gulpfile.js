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
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');

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
    if (callback) {
      callback();
    }
  };
}

gulp.task('copy-polyfill', function () {
  return gulp.src('./node_modules/babel-core/browser-polyfill.js')
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('copy-ismobile', function () {
  return gulp.src(['./bower_components/isMobile/isMobile.min.js'])
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('copy-onsenui-css', function () {
  return gulp.src(['./bower_components/onsenui/build/css/**/*'])
    .pipe(gulp.dest('./public/assets/onsenui-css'));
});

gulp.task('build-stylesheets-dev', function () {
  return gulp.src('./stylesheets/mobile/index.less')
    .pipe(rename('mobile.bundle.less'))
    .pipe(plumber({ errorHandler: errorHandler('Less') }))
    .pipe(less({
      paths: [
        path.join(__dirname, 'stylesheets', 'mobile')
      ]
    }))
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('build-stylesheets', function () {
  return gulp.src('./stylesheets/mobile/index.less')
    .pipe(rename('mobile.bundle.less'))
    .pipe(plumber({ errorHandler: errorHandler('Less') }))
    .pipe(less({
      paths: [
        path.join(__dirname, 'stylesheets', 'mobile')
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

gulp.task('copy-config-dev', function () {
  return gulp.src('./config/development.js')
    .pipe(rename('config.js'))
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('copy-config', function () {
  return gulp.src('./config/production.js')
    .pipe(rename('config.js'))
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('copy-mobile-libraries-dev', function () {
  return gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/onsenui/build/js/onsenui.js',
    './bower_components/leancloud-javascript-sdk/dist/av.js',
    './bower_components/history/scripts/bundled-uncompressed/html5/native.history.js'
  ]).pipe(concat('mobile.vendor.js'))
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('copy-mobile-libraries', function () {
  return gulp.src([
    './bower_components/angular/angular.min.js',
    './bower_components/onsenui/build/js/onsenui.min.js',
    './bower_components/leancloud-javascript-sdk/dist/av-mini.js',
    './bower_components/history/scripts/bundled/html5/native.history.js'
  ]).pipe(concat('mobile.vendor.js'))
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('build-assets-dev', [
  'copy-polyfill',
  'copy-ismobile',
  'copy-onsenui-css',
  'copy-config-dev',
  'copy-mobile-libraries-dev',
  'build-stylesheets-dev',
  'build-scripts-dev'
]);

gulp.task('build-assets', [
  'copy-polyfill',
  'copy-ismobile',
  'copy-onsenui-css',
  'copy-config',
  'copy-mobile-libraries',
  'build-stylesheets',
  'build-scripts'
]);

gulp.task('watch', ['build-assets-dev'], function () {
  gulp.watch('./stylesheets/**/*.less', ['build-stylesheets']);
  var config = require('./webpack.config');
  config.devtool = 'source-map';
  config.watch = true;
  webpack(config, webpackCallback());
});

gulp.task('serve', function () {
  gulp.src('public').
    pipe(webserver({
      host: '0.0.0.0'
    }));
});
