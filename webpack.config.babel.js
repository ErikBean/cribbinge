const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {
  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'public'),
      publicPath: '/webpackPublicPath'
    },
    module: {
      rules: [
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
    mode: 'production',
    devtool: 'inline-source-map',
    plugins: [
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./public/vendor-manifest.json')
      })
    ]
  }
};