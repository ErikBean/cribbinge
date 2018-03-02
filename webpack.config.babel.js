const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {
  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/webpackPublicPath'
    },
    module: {
      loaders: [
        {
          test: /\.(js)$/,
          loader: 'babel-loader',
          query: {
            cacheDirectory: true,
          },
          exclude: /node_modules/,
        },
      ]
    },
    plugins: [
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./dist/vendor-manifest.json')
      })
    ]
  }
};