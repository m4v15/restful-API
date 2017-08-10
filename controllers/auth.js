const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const User = require('../models/user')
const Authenticate = {}

module.exports = Authenticate

passport.use(new BasicStrategy(
  (username, pw, cb) => {
    User.findOne({username})
    .then(user => {
      if (!user) return cb(null, false)
      // passport needs to use callbacks not promises
      user.verifyPassword(pw, (err, correct) => {
        if (err) return cb(err)
        if (!correct) return cb(null, false)
        return cb(null, user)
      })
    })
    .catch(cb)
  }
  )
)

Authenticate.isAuthenticated = passport.authenticate('basic', { session: false })
