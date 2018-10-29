const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    popup: './src/popup/index.jsx',
    background: './src/background/index.js',
    content: './src/content/index.js'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
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
    ])
  ],

  resolve: {
    extensions: ['.js', '.jsx']
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].min.js'
  }
};
