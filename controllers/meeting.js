const Meeting = require('../models/meeting')

const create = {
  httpMethod: 'post',
  path: '/create',
  action: async (req, res) => {
    const user = await req.user.exec()

    await Meeting.create({
      name: req.body.name,
      date: req.body.date,
      professor: user.id,
    })

    res.redirect('/dashboard')
  },
  authed: true,
}

module.exports = [create]
