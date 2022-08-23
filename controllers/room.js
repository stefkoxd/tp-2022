const joinRoom = {
  httpMethod: 'get',
  path: '/:meeting/:room',
  action: (req, res) => {
    res.status(200).render('room', { roomId: req.params.room })
  },
}

module.exports = [joinRoom]
