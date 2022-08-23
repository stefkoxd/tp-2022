const joinRoom = {
  httpMethod: 'get',
  path: '/:course/:room',
  function: (req, res) => {
    res.status(200).render('room', { roomId: req.params.room })
  },
}

module.exports = [joinRoom]
