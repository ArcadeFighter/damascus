module.exports = {
  productionSourceMap: false,
  publicPath:'./',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Damascus.gg – Modern Warfare camouflage tracker',
      description: 'Keep track of your progress to the sought after Damascus camouflage with this easy-to-use tracker.',
      url: 'https://damascus.gg/',
      image: 'meta-image.png'
    }
  }
}