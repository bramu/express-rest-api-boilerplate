var path = require('path');
// var CopyWebpackPlugin = require('copy-webpack-plugin');
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode:'development',
  entry: {
    home:'./assets/home.js', 
    styles:'./style.scss'
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  devServer: {
      contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
  // watchOptions:  300,
  plugins: [
  new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
  ]
};