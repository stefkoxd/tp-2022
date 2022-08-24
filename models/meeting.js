const mongoose = require('mongoose')

const { Schema, model } = mongoose

const meetingSchema = Schema({
  name: String,
  date: Date,
})

const Meeting = model('Meeting', meetingSchema)

module.exports = Meeting
