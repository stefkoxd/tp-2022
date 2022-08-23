const express = require('express')
const app = express()
const server = require('http').Server(app)
const nunjucks = require('nunjucks')

nunjucks.configure('views', {
  autoescape: true,
  express: app,
})
app.set('view engine', 'njk')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.status(200).render('room')
})

server.listen(8080)
