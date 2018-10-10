'use strict'

module.exports = {
  watchDirs: [
    './lib', './components'
  ],
  js: [{
    source: "./lib/polyfills.js",
    target: "./assets/polyfills.js"
  },{
    source: "./lib/index.js",
    target: "./assets/bundle.js"
  }],
  sass: [
    {
      source: './lib/index.scss',
      target: './assets/bundle.css'
    }
  ],
  static: [
    {
      source: './lib/images',
      target: './assets/images'
    }
  ],
  manifest: {
    target: './assets/manifest.json',
    key: 'short',
    webRoot: './assets'
  }
}
