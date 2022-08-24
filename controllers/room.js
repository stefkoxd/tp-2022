const Meeting = require('../models/meeting')

// TODO: Proper error handling
const joinRoom = {
  httpMethod: 'get',
  path: '/:room',
  action: async (req, res, next) => {
    const meetingId = req.params.room

    try {
      const meeting = await Meeting.findById(meetingId)

      if (meeting) {
        res.status(200).render('room', {
          roomId: req.params.room,
          meetingName: meeting.name,
        })
      } else {
        res.status(404)
      }
    } catch (e) {
      console.error(e)
      next()
    }
  },
}

module.exports = [joinRoom]
