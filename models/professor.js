const mongoose = require('mongoose')

const { Schema, model } = mongoose

const professorSchema = new Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  meetings: [mongoose.ObjectId],
})

const Professor = model('Professor', professorSchema)

module.exports = Professor
