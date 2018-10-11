'use strict'

module.exports = {
  watchDirs: [
    './lib', './components'
  ],
  js: [{
    source: "./lib/polyfills.js",
    target: "./dist/polyfills.js"
  },{
    source: "./lib/index.js",
    target: "./dist/tabelle.js"
  }],
  sass: [
    {
      source: './lib/style/style.scss',
      target: './dist/tabelle.css'
    }
  ],
  static: [
    {
      source: './lib/images',
      target: './dist/images'
    }
  ],
  manifest: {
    target: './dist/manifest.json',
    key: 'short',
    webRoot: './dist'
  }
}
