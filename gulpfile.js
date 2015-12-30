'use strict';

const gulp = require('gulp');
const jade = require('gulp-jade');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const webpack = require('webpack-stream');
const webpackConf = require('./webpack.config.js');

gulp.task('jade', () => {
  gulp.src(['tpl/popup.jade', 'tpl/options.jade'])
    .pipe(jade())
    .pipe(gulp.dest('build'));
});

gulp.task('imagemin', () => {
  gulp.src('img/icon.png')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('build/img'));
});

gulp.task('webpack', () => {
  gulp.src('./src/*.js')
    .pipe(webpack(webpackConf))
    .pipe(gulp.dest('build'));
});

gulp.task('default', ['jade', 'imagemin', 'webpack'], () => {
  gulp.watch(['./tpl/*.jade'], ['jade']);
  gulp.watch(['./tpl/*.jade', './style/*.scss', './src/*.js', './src/*/*.js'], ['webpack']);
});
