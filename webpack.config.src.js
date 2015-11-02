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
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
  ]
};
