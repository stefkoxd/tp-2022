const fs = require('fs')
const express = require('express')
const router = express.Router()

/**
 * Controller collector method
 * Collects controllers defined in the controllers directory
 */
const collect = () => {
  const ctls = fs.readdirSync('./controllers')
  ctls.forEach((ctl) => {
    const ctlFns = require(`./controllers/${ctl}`)
    ctlFns.forEach((ctlFn) => {
      router[ctlFn.httpMethod](ctlFn.path, ctlFn.function)
    })
  })
}

module.exports = { router, collect }
