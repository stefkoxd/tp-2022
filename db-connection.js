const mongoose = require('mongoose')

const databaseConnection = () => {
  const env = process.env.ENVIRONMENT

  if (env) {
    if (env === 'local') {
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
            console.log('connected to local db')
          },
          err => {
            console.error(err)
          }
        )
    } else {
      const databaseUser = process.env.DATABASE_USER
      const databasePassword = process.env.DATABASE_PASSWORD

      mongoose
        .connect(
          `mongodb+srv://${databaseUser}:${databasePassword}@cluster0.4v4ql.mongodb.net/tpvc-db?retryWrites=true&w=majority`
        )
        .then(
          () => {
            console.log('connected to remote db')
          },
          err => {
            console.error(err)
          }
        )
    }
  } else {
    throw new Error('Environment not provided')
  }
}

module.exports = {
  databaseConnection,
}
