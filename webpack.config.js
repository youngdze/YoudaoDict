'use strict';

import path from 'path';
import webpack from 'webpack';
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

export default {
  context: path.join(__dirname),
  entry: {
    './js/bubble': ['./src/script/bubble.js'],
    './js/popup': ['./src/script/popup.js'],
    './js/background': ['./src/script/background.js'],
    './js/options': ['./src/script/options.js']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-0']
      }
    },{
      test: /\.(css|scss)$/,
      exclude: /node_modules/,
      loaders: ['style', 'css', `sass?${['outputStyle=compressed'].join('&')}`]
    }, {
      test: /\.(eot|ttf|woff|woff2|svg)$/,
      exclude: /node_modules/,
      loader: 'file?name=font/[name].[ext]'
    }, {
      test: /\.jade$/,
      exclude: /node_modules/,
      loader: 'jade'
    }]
  },

  plugins: [
    // new UglifyJsPlugin({compress: {warnings: false}})
  ]
};
