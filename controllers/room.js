const joinRoom = {
  httpMethod: 'get',
  path: '/:room',
  action: (req, res) => {
    res.status(200).render('room', { roomId: req.params.room })
  },
}

module.exports = [joinRoom]
