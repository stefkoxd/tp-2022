const Meeting = require('../models/meeting')

const dashboard = {
  httpMethod: 'get',
  path: '/',
  action: async (req, res) => {
    const user = await req.user.exec()

    const meetings = await Meeting.find({
      professor: user._id,
    }).exec()

    res.status(200).render('dashboard', { user, meetings })
  },
  authed: true,
}

const dashboardCreate = {
  httpMethod: 'get',
  path: '/create',
  action: async (req, res) => {
    const user = await req.user.exec()
    res.status(200).render('create-meeting', { user })
  },
  authed: true,
}

module.exports = [dashboard, dashboardCreate]
