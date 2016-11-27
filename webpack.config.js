const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

let nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

const packageData = require('./package.json');

const filename = [packageData.name, packageData.version, 'js'];

module.exports = {
    entry: path.resolve(__dirname, packageData.main),
    output: {
        path: path.resolve(__dirname, 'app/build'),
        filename: filename.join('.'),
    },
    devtool: 'source-map',
    externals: nodeModules,
    plugins: [
      new webpack.BannerPlugin('require("source-map-support").install();',
                             { raw: true, entryOnly: false })
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'react']
          }
        }
      ]
    }
};
