const Meeting = require('../models/meeting')

const create = {
  httpMethod: 'post',
  path: '/create',
  action: async (req, res) => {
    const user = await req.user.exec()

    const meeting = await Meeting.create({
      name: req.body.name,
      date: req.body.date,
    })

    user.meetings.push(meeting.id)
    user.save()

    res.redirect('/dashboard')
  },
  authed: true,
}

module.exports = [create]
