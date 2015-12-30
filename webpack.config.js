'use strict';

const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
  context: path.join(__dirname),
  entry: {
    './js/bubble': ['./src/app.js'],
    './js/popup': ['./src/popup.js'],
    './js/background': ['./src/background.js'],
    './js/options': ['./src/options.js']
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
      test: /\.s?css$/,
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
