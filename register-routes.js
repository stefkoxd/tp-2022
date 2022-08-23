const fs = require('fs')
const path = require('path')
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
    const basePath = path.parse(`./controllers/${ctl}`).name
    ctlFns.forEach((ctlFn) => {
      router[ctlFn.httpMethod](
        basePath === 'index' ? ctlFn.path : `/${basePath}${ctlFn.path}`,
        ctlFn.action
      )
    })
  })
}

module.exports = { router, collect }
