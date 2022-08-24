const mongoose = require('mongoose')

const { Schema, model } = mongoose

const meetingSchema = Schema({
  _id: String,
  name: String,
  date: Date,
  password: String,
})

const Meeting = model('Meeting', meetingSchema)

module.exports = Meeting
