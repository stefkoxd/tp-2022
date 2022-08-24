const mongoose = require('mongoose')

const { Schema, model } = mongoose

const meetingSchema = Schema({
  name: String,
  date: Date,
  password: String,
  roomNumber: String,
})

const Meeting = model('Meeting', meetingSchema)

module.exports = Meeting
