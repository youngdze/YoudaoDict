'use strict';

import gulp from 'gulp';
import jade from 'gulp-jade';
import mocha from 'gulp-mocha';
import rimraf from 'gulp-rimraf';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import webpack from 'webpack-stream';
import webpackConf from './webpack.config.js';

const NODE_ENV = process.env.NODE_ENV || 'dev';

gulp.task('clean', () => {
  gulp.src('build/**/*.map', {read: false}).pipe(rimraf({force: true}));
});

gulp.task('move', () => {
  gulp.src('manifest.json').pipe(gulp.dest('build'));
  gulp.src('src/lib/**/*.js').pipe(gulp.dest('build/lib'));
});

gulp.task('jade', () => {
  gulp.src(['src/tpl/popup.jade', 'src/tpl/options.jade'])
    .pipe(jade({
      pretty: true
    }))
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

gulp.task('mocha', () => {
  gulp.src('./test/**/*.js', {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', ['move', 'jade', 'imagemin', 'webpack'], () => {
  gulp.watch(['./manifest.json'], ['move']);
  gulp.watch(['./src/tpl/*.jade'], ['jade']);
  gulp.watch(['./src/tpl/*.jade', './src/style/*.scss', './src/script/**/*.js'], ['webpack']);
});

gulp.task('build', ['clean', 'move', 'jade', 'imagemin', 'webpack']);
gulp.task('test', ['mocha']);
