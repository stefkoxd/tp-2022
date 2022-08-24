const bcrypt = require('bcrypt')
const Professor = require('../models/professor')

const home = {
  httpMethod: 'get',
  path: '/',
  action: (req, res) => {
    res.status(200).render('home')
  },
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
      res.sendStatus(201)
    } catch (e) {
      console.error(e)
      res.status(500).send()
    }
  },
}

const login = {
  httpMethod: 'post',
  path: '/login',
  action: async (req, res) => {
    const professor = await Professor.findOne({ email: req.body.email })
    if (!professor) {
      res.sendStatus(400).send('Cannot find user')
    }
    try {
      if (await bcrypt.compare(req.body.password, professor.password)) {
        res.send('Success')
      } else {
        res.status(401).send('Unauthorized')
      }
    } catch (e) {
      res.status(500).send()
    }
  },
}

module.exports = [home, login, register]
