const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const Professor = require('./models/professor')

const init = passport => {
  const authenticateUser = async (email, password, done) => {
    const user = await Professor.findOne({ email })

    if (!user) {
      return done(null, false, { message: 'Wrong email or password' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Wrong email or password' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user._id))
  passport.deserializeUser((id, done) => done(null, Professor.findById(id)))
}

module.exports = init
