const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/popup/index.jsx',
    background: './src/background/index.js',
    content: './src/content/index.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
        }
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'src', 'popup', 'index.html'),
        to: path.join(__dirname, 'dist')
      },
      {
        from: path.join(__dirname, 'src', 'popup', 'index.css'),
        to: path.join(__dirname, 'dist')
      }
    ]),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      sourceMap: false
    })
  ],

  resolve: {
    extensions: ['.js', '.jsx']
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].min.js'
  }
};
