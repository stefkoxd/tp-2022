const express = require('express')
const app = express()
const server = require('http').Server(app)
const nunjucks = require('nunjucks')
const { collect: ctlCollector, router } = require('./register-routes')

nunjucks.configure('views', {
  autoescape: true,
  express: app,
})
app.set('view engine', 'njk')

ctlCollector()
// Socket.io allows us to do real-time communication
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
})

// PeerJS allows us to implement WebRTC
const { PeerServer } = require('peer')

// eslint-disable-next-line no-unused-vars
const peerServer = PeerServer({
  debug: true,
  port: 9000,
  path: '/peerjs',
})

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.on('ready', () => {
      socket.broadcast.to(roomId).emit('user-connected', userId)
    })
  })
})

app.use(express.static('public'))
app.use('', router)

server.listen(8080)
