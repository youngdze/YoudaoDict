var path = require('path');

module.exports = {
  context: path.resolve(__dirname),
  entry: './js/bubble.js',

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
      {
        test: /\.jade$/,
          loader: 'jade'
      }
    ]
  }
};