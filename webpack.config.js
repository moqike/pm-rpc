const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    child: './dev/child.ts',
    parent: './dev/parent.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'child.html',
      template: './dev/child.html',
      chunks: ['child']
    }),
    new HtmlWebpackPlugin({
      filename: 'parent.html',
      template: './dev/parent.html',
      chunks: ['parent']
    })
  ]
};