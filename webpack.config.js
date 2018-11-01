module.exports = () => ({
  entry: ['./index.js'],
  module: {
    rules: [{
      test: /\.js/,
      use: 'babel-loader',
      exclude: /node_modules/
    }]
  }
})