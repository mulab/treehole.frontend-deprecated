'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var rename = require("gulp-rename");
var path = require('path');
var webpack = require('webpack');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');
var uuid = require('node-uuid');
var replace = require('gulp-replace');
var merge = require('merge-stream');

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
    .pipe(gulp.dest('./build/assets'));
});

gulp.task('copy-ismobile', function () {
  return gulp.src(['./bower_components/isMobile/isMobile.min.js'])
    .pipe(gulp.dest('./build/assets'));
});

gulp.task('copy-onsenui-css', function () {
  return gulp.src(['./bower_components/onsenui/build/css/**/*'])
    .pipe(gulp.dest('./build/assets/onsenui-css'));
});

gulp.task('copy-photoswipe-css', function () {
  return gulp.src(['./bower_components/photoswipe/dist/**/*'])
    .pipe(gulp.dest('./build/assets/photoswipe'));
});

gulp.task('build-stylesheets-dev', function () {
  return gulp.src('./stylesheets/mobile/index.less')
    .pipe(rename('mobile.bundle.less'))
    .pipe(plumber({ errorHandler: errorHandler('Less') }))
    .pipe(less({
      paths: [
        path.join(__dirname, 'bower_components'),
        path.join(__dirname, 'stylesheets', 'mobile')
      ]
    }))
    .pipe(gulp.dest('./build/assets'));
});

gulp.task('build-stylesheets', function () {
  return gulp.src('./stylesheets/mobile/index.less')
    .pipe(rename('mobile.bundle.less'))
    .pipe(plumber({ errorHandler: errorHandler('Less') }))
    .pipe(less({
      paths: [
        path.join(__dirname, 'bower_components'),
        path.join(__dirname, 'stylesheets', 'mobile')
      ]
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./build/assets'));
});

gulp.task('build-scripts-dev', function (callback) {
  var config = require('./webpack.config');
  config.devtool = 'source-map';
  webpack(config, webpackCallback(callback));
});

gulp.task('build-scripts', function (callback) {
  var config = require('./webpack.config');
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    mangle: {
      except: ['$scope', '$rootScope', '$compile', '$timeout', '$interval', 'resizeService']
    }
  }));
  webpack(config, webpackCallback(callback));
});

gulp.task('copy-config-dev', function () {
  return gulp.src('./config/development.js')
    .pipe(rename('config.js'))
    .pipe(gulp.dest('./build/assets'));
});

gulp.task('copy-config', function () {
  return gulp.src('./config/production.js')
    .pipe(rename('config.js'))
    .pipe(gulp.dest('./build/assets'));
});

gulp.task('copy-mobile-libraries-dev', function () {
  return gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/onsenui/build/js/onsenui.js',
    './bower_components/leancloud-javascript-sdk/dist/av.js',
    './bower_components/history/scripts/bundled-uncompressed/html5/native.history.js',
    './bower_components/ng-img-crop/compile/unminified/ng-img-crop.js',
    './bower_components/angular-images-resizer/angular-images-resizer.js',
    './bower_components/photoswipe/dist/photoswipe.js',
    './bower_components/photoswipe/dist/photoswipe-ui-default.js'
  ]).pipe(concat('mobile.vendor.js'))
    .pipe(gulp.dest('./build/assets'));
});

gulp.task('copy-mobile-libraries', function () {
  return gulp.src([
    './bower_components/angular/angular.min.js',
    './bower_components/onsenui/build/js/onsenui.min.js',
    './bower_components/leancloud-javascript-sdk/dist/av-mini.js',
    './bower_components/history/scripts/bundled/html5/native.history.js',
    './bower_components/ng-img-crop/compile/minified/ng-img-crop.js',
    './bower_components/angular-images-resizer/angular-images-resizer.js',
    './bower_components/photoswipe/dist/photoswipe.min.js',
    './bower_components/photoswipe/dist/photoswipe-ui-default.min.js'
  ]).pipe(concat('mobile.vendor.js'))
    .pipe(gulp.dest('./build/assets'));
});

gulp.task('build-assets-dev', [
  'copy-polyfill',
  'copy-ismobile',
  'copy-onsenui-css',
  'copy-photoswipe-css',
  'copy-config-dev',
  'copy-mobile-libraries-dev',
  'build-stylesheets-dev',
  'build-scripts-dev'
]);

gulp.task('build-assets', [
  'copy-polyfill',
  'copy-ismobile',
  'copy-onsenui-css',
  'copy-photoswipe-css',
  'copy-config',
  'copy-mobile-libraries',
  'build-stylesheets',
  'build-scripts'
]);

gulp.task('copy-static', function () {
  return gulp.src(['./static/**/*'])
    .pipe(gulp.dest('./build'));
});

gulp.task('uuid-assets', ['build-assets'], function () {
  var rev = uuid.v1();

  var copyAssets = gulp.src(['./build/assets/**/*'])
    .pipe(gulp.dest('./build/assets-' + rev));

  var replaceMainIndex = gulp.src(['./static/index.html'])
    .pipe(replace('/assets/', '/assets-' + rev + '/'))
    .pipe(gulp.dest('./build'));
  var replaceMobileIndex = gulp.src(['./static/mobile/index.html'])
    .pipe(replace('/assets/', '/assets-' + rev + '/'))
    .pipe(gulp.dest('./build/mobile'));

  return merge(copyAssets, replaceMainIndex, replaceMobileIndex);
});

gulp.task('build-dev', [
  'copy-static',
  'build-assets-dev'
]);

gulp.task('build', [
  'copy-static',
  'build-assets',
  'uuid-assets'
]);

gulp.task('watch', ['build-dev'], function () {
  gulp.watch('./stylesheets/**/*.less', ['build-stylesheets']);
  gulp.watch('./static/**/*', ['copy-static']);
  var config = require('./webpack.config');
  config.devtool = 'source-map';
  config.watch = true;
  webpack(config, webpackCallback());
});

gulp.task('serve', function () {
  gulp.src('build').
    pipe(webserver({
      host: '0.0.0.0'
    }));
});
