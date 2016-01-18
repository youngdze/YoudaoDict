'use strict';

import path from 'path';
import webpack from 'webpack';

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const NODE_ENV = process.env.NODE_ENV || 'dev';

let conf = {
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

  plugins: []
};

if(Object.is(NODE_ENV, 'production')) {
  let plugins = conf.plugins;
  plugins.push(new UglifyJsPlugin({compress: {warnings: false}}));
  conf = Object.assign({}, conf, {plugins});
} else {
  conf = Object.assign({}, conf, {
    debug: true,
    cache: true,
    devtool: 'source-map',
    node: {console: true}
  });
}

export default conf;
