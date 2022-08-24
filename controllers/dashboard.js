const Meeting = require('../models/meeting')

const dashboard = {
  httpMethod: 'get',
  path: '/',
  action: async (req, res) => {
    const user = await req.user.exec()

    const userMeetings = user.meetings.map(meeting => meeting._id)

    const meetings = await Meeting.find({
      _id: {
        $in: userMeetings,
      },
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
