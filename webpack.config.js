'use strict';

const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
  context: path.join(__dirname),
  entry: {
    './js/bubble': ['./src/script/bubble.js'],
    './js/popup': ['./src/script/popup.js'],
    './js/background': ['./src/script/background.js'],
    './js/options': ['./src/script/options.js']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
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
      loaders: ['style', 'css', 'sass'],
      exclude: /node_modules/
    }, {
      test: /\.(eot|ttf|woff|woff2|svg)$/,
      loader: 'file?name=font/[name].[ext]',
      exclude: /node_modules/
    }, {
      test: /\.jade$/,
      loader: 'jade',
      exclude: /node_modules/
    }]
  },

  plugins: [
    // new UglifyJsPlugin({compress: {warnings: false}})
  ]
};
