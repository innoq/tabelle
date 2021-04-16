'use strict'

module.exports = {
  watchDirs: [
    './lib'
  ],
  js: [{
    source: './lib/polyfills.js',
    target: './dist/polyfills.js'
  }, {
    source: './lib/index.js',
    target: './dist/tabelle.js'
  }],
  sass: [
    {
      source: './lib/style/base.scss',
      target: './dist/tabelle-base.css'
    }, {
      source: './lib/style/style.scss',
      target: './dist/tabelle.css'
    }
  ],
  manifest: {
    target: './dist/manifest.json',
    key: 'short',
    webRoot: './dist'
  }
}
