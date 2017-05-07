const isProd = process.env.NODE_ENV === 'production';

const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const devtool = !isProd ? 'source-map' : '';

const buildModule = {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: 'babel-loader',
    },
  ],
};

const plugins = [];
if (isProd) plugins.push(new UglifyJSPlugin())

module.exports = {
  entry: ['./app/index.js'],
  output: {
    filename: './public/main.min.js',
  },
  devtool,
  module: buildModule,
  plugins
}
