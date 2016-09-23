/* eslint-disable global-require */
/* eslint-env browser */
'use strict'

// Promise polyfill
if (typeof Promise === 'undefined') {
  require('promise/lib/rejection-tracking').enable()
  window.Promise = require('promise/lib/es6-extensions.js')
}

// fetch polyfill
require('whatwg-fetch')

// Object.assign polyfill
Object.assign = require('object-assign')
