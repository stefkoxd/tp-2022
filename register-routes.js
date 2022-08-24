const fs = require('fs')
const path = require('path')
const express = require('express')
const router = express.Router()

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * Function that adds authentication requirement for certain paths
 */
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

/**
 * Controller collector method
 * Collects controllers defined in the controllers directory
 */
const collect = () => {
  const ctls = fs.readdirSync('./controllers')
  ctls.forEach(ctl => {
    const ctlFns = require(`./controllers/${ctl}`)
    const basePath = path.parse(`./controllers/${ctl}`).name
    ctlFns.forEach(ctlFn => {
      if (ctlFn.authed) {
        router[ctlFn.httpMethod](
          basePath === 'index' ? ctlFn.path : `/${basePath}${ctlFn.path}`,
          checkAuthenticated,
          ctlFn.action
        )
      } else
        router[ctlFn.httpMethod](
          basePath === 'index' ? ctlFn.path : `/${basePath}${ctlFn.path}`,
          ctlFn.action
        )
    })
  })
}

module.exports = { router, collect }
