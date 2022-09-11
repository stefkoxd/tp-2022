const Meeting = require('../models/meeting')

const create = {
  httpMethod: 'post',
  path: '/save',
  action: async (req, res) => {
    const user = await req.user.exec()

    const item = await Meeting.create({
      name: req.body.name,
      date: req.body.date,
      professor: user.id,
    })
    console.log(item)

    res.redirect('/dashboard')
  },
  authed: true,
}

const update = {
  httpMethod: 'post',
  path: '/save/:id',
  action: async (req, res) => {
    const user = await req.user.exec()

    await Meeting.updateOne(
      {
        _id: req.params.id,
        professor: user.id,
      },
      {
        name: req.body.name,
        date: req.body.date,
      }
    )

    res.redirect('/dashboard')
  },
  authed: true,
}

const delete_ = {
  httpMethod: 'delete',
  path: '/delete/:id',
  action: async (req, res) => {
    const user = await req.user.exec()

    console.log(req.params.id)

    await Meeting.deleteOne({
      _id: req.params.id,
      professor: user.id,
    })

    res.redirect('/dashboard')
  },
  authed: true,
}

module.exports = [create, update, delete_]
