const mongoose = require('mongoose')

const { Schema, model } = mongoose

const messsageSchema = Schema({
  userId: String,
  username: String,
  message: String,
  roomId: mongoose.ObjectId,
})

const Message = model('Message', messsageSchema)

module.exports = Message
