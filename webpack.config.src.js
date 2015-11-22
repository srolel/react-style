var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './build/index',
  output: {
    filename: 'dist/react-styles.js',
    libraryTarget: 'umd',
    library: 'react-styles'
  },
  externals: [{
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  }],
  loaders: [
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel' // 'babel-loader' is also a legal name to reference
    }
  ],
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
  ]
};
