module.exports = {
  entry: {
    auctioneer: './src/auctioneer/index.js',
    bidder: './src/bidder/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
}