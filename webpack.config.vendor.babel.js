const path = require('path');
const webpack = require('webpack');


module.exports = {
  entry: {
    vendor: [
      'react',
      'react-dom',
    ]
  },
  output: {
    filename: 'vendor.dll.js',
    path: path.resolve(__dirname, 'dist'),
    library: "[name]",
  },
  module: {},
  plugins: [
    new webpack.DllPlugin({
      name: "[name]",
      path: path.join(__dirname, "dist", "[name]-manifest.json"),
    })
  ]
};