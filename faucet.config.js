'use strict'

module.exports = {
  watchDirs: [
    './lib', './components'
  ],
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
  ]
}