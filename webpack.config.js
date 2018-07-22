const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const { HotModuleReplacementPlugin } = require('webpack');

module.exports = {
  mode: "development",
  entry: './examples/index.tsx',
  output: {
    filename: 'examples/main.js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          "useBabel": true,
          "babelOptions": {
            "babelrc": false, /* Important line */
            "presets": [
              ["@babel/preset-env", {
                "targets": {
                  "browsers": ["last 2 versions", "ie 10"]
                },
                "modules": false
              }],
              "@babel/preset-react",
            ]
          },
          "babelCore": "@babel/core", // needed for Babel v7
        }
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    host: '127.0.0.1',
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Draft js WYSIWYG example!',
      template: './examples/index.html'
    }),
    new CheckerPlugin(),
    new HotModuleReplacementPlugin(),
  ]
};
