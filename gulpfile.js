'use strict';

const gulp = require('gulp');
const jade = require('gulp-jade');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const webpack = require('webpack-stream');
const webpackConf = require('./webpack.config.js');

gulp.task('jade', () => {
  gulp.src(['src/tpl/popup.jade', 'src/tpl/options.jade'])
    .pipe(jade())
    .pipe(gulp.dest('build'));
});

gulp.task('imagemin', () => {
  gulp.src('src/img/icon.png')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('build/img'));
});

gulp.task('webpack', () => {
  gulp.src('./src/script/*.js')
    .pipe(webpack(webpackConf))
    .pipe(gulp.dest('build'));
});

gulp.task('default', ['jade', 'imagemin', 'webpack'], () => {
  gulp.watch(['./src/tpl/*.jade'], ['jade']);
  gulp.watch(['./src/tpl/*.jade', './src/style/*.scss', './src/script/*.js', './src/script/*/*.js'], ['webpack']);
});
