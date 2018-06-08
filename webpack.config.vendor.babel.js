const path = require('path');
const webpack = require('webpack');


module.exports = {
  entry: {
    vendor: [
      '@material-ui/core',
      '@material-ui/icons',
      'apollo-boost',
      'firebase',
      'material-ui',
      'ramda',
      'react-apollo',
      'react-dom',
      'react-firebase',
      'react-firebaseui/StyledFirebaseAuth',
      'react-hot-loader',
      'react',
      'reselect',
    ]
  },
  mode: 'development',
  output: {
    filename: 'vendor.dll.js',
    path: path.resolve(__dirname, 'public'),
    library: "[name]",
  },
  module: {},
  plugins: [
    new webpack.DllPlugin({
      name: "[name]",
      path: path.join(__dirname, "public", "[name]-manifest.json"),
    })
  ]
};