const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    child: './test/child.ts',
    parent: './test/parent.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'child.html',
      template: './test/child.html',
      chunks: ['child']
    }),
    new HtmlWebpackPlugin({
      filename: 'parent.html',
      template: './test/parent.html',
      chunks: ['parent']
    })
  ]
};