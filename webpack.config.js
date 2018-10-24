var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require("html-webpack-plugin");

var config = {
  entry: "./src/js/index.js",
  output: {
    path: path.resolve(__dirname, "dist/js"),
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader"
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  },
  plugins: [
    // new webpack.optimize.AggressiveSplittingPlugin({
    //   minSize: 50 * 1024,
    //   maxSize: 100 * 1024
    // }),
    // new HtmlWebpackPlugin({
    //   template: "src/index.html",
    //   filename: "../index.html"
    // })
  ],
  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      vue: "vue/dist/vue.js"
    }
  },
  stats: {
    colors: true
  },
  devtool: "source-map"
};

module.exports = config;
