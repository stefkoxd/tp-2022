const bcrypt = require('bcrypt')
const passport = require('passport')
const Professor = require('../models/professor')

// TODO: Remove auth from home page
// This includes fixing the home.njk template too
const home = {
  httpMethod: 'get',
  path: '/',
  action: async (req, res) => {
    const user = await req.user.exec()
    res.status(200).render('home', { user })
  },
  authed: true,
}

const register = {
  httpMethod: 'post',
  path: '/register',
  action: async (req, res) => {
    try {
      const exists = await Professor.findOne({ email: req.body.email })
      if (exists) {
        throw new Error('User already exists')
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      Professor.create({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hashedPassword,
        meetings: [],
      })
      res.redirect('/login')
    } catch (e) {
      console.error(e)
      res.redirect('/register')
    }
  },
}

const login = {
  httpMethod: 'post',
  path: '/login',
  action: passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  }),
}

const loginPage = {
  httpMethod: 'get',
  path: '/login',
  action: (req, res) => {
    res.render('login')
  },
}

const registerPage = {
  httpMethod: 'get',
  path: '/register',
  action: (req, res) => {
    res.render('register')
  },
}

const logout = {
  httpMethod: 'delete',
  path: '/logout',
  action: (req, res, next) => {
    req.logOut(err => {
      if (err) {
        return next(err)
      }
      res.redirect('/login')
    })
  },
}

module.exports = [home, login, register, loginPage, registerPage, logout]
