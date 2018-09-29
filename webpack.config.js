var projConfig = require('./proj.config.js');
var webpack = require("webpack");

var config = {
  entry: "./src/js/index.js",
  output: {
    path: __dirname + "/dist/js/",
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      Promise: "promise-polyfill"
    })
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

if(projConfig.mergeCss){
  config.module.loaders.push({
    test: /\.css$/,
    loader: 'style!css'
  });
}

module.exports = config;