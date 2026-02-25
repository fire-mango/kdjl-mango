module.exports = {
  target: 'electron-preload',
  mode: 'development',
  entry: './preload.js',
  output: {
    filename: 'preload.js',
    path: path.resolve(__dirname, '.webpack/preload')
  },
  node: {
    __dirname: false,
    __filename: false
  }
};