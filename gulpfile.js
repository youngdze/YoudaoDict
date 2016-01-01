'use strict';

const gulp = require('gulp');
const jade = require('gulp-jade');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const webpack = require('webpack-stream');
const webpackConf = require('./webpack.config.js');

const NODE_ENV = process.env.NODE_ENV || 'dev';

gulp.task('manifest', () => {
  gulp.src('manifest.json').pipe(gulp.dest('build'));
});

gulp.task('moveLib', () => {
  gulp.src('src/lib/**/*.js').pipe(gulp.dest('build/lib'));
});

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

gulp.task('default', ['manifest', 'moveLib', 'jade', 'imagemin', 'webpack'], () => {
  if(Object.is(NODE_ENV, 'dev')) {
    gulp.watch(['./manifest.json'], ['manifest']);
    gulp.watch(['./src/tpl/*.jade'], ['jade']);
    gulp.watch(['./src/tpl/*.jade', './src/style/*.scss', './src/script/**/*.js'], ['webpack']);
  }
});
