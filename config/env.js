'use strict'

const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development')

module.exports = {
  'process.env.NODE_ENV': NODE_ENV,
}
