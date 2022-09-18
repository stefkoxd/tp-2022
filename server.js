const express = require('express')
const app = express()
const server = require('http').Server(app)
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const { collect: ctlCollector, router } = require('./register-routes')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const Message = require('./models/message')
const { databaseConnection } = require('./db-connection')

if (process.env.ENVIRONMENT !== 'production') {
  require('dotenv').config()
}

const initPassport = require('./passport-config')
initPassport(passport)

databaseConnection()

nunjucks.configure('views', {
  autoescape: true,
  express: app,
})

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(bodyParser.json())

app.use(flash())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

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
  socket.on('join-room', (roomId, userId, username) => {
    socket.join(roomId)
    socket.on('ready', () => {
      socket.broadcast.to(roomId).emit('user-connected', userId)
    })
    socket.on('message', async msg => {
      await Message.create({
        userId,
        username,
        roomId,
        message: msg,
      })
      io.to(roomId).emit('createMessage', msg, username)
    })
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', userId)
    })
  })
})

app.use('/static', express.static('public'))
app.use('', router)

server.listen(8080)
