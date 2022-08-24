const express = require('express')
const app = express()
const server = require('http').Server(app)
const nunjucks = require('nunjucks')
const { collect: ctlCollector, router } = require('./register-routes')
const mongoose = require('mongoose')

mongoose
  .connect('mongodb://localhost:27017/tpvc-db?authSource=admin&w=1', {
    auth: {
      authSource: 'admin',
    },
    user: 'root',
    pass: 'password',
  })
  .then(
    () => {
      console.log('connected to db')
    },
    err => {
      console.error(err)
    }
  )

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

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.on('ready', () => {
      socket.broadcast.to(roomId).emit('user-connected', userId)
    })
    socket.on('message', msg => {
      io.to(roomId).emit('createMessage', msg, userId)
    })
  })
})

app.use('/static', express.static('public'))
app.use('', router)

server.listen(8080)
