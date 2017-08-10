const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const User = require('../models/user')
const Client = require('../models/client')

const Authenticate = module.exports = {}

// Passport will look for username and password in the Authorisation header
// (or at least it will in this case) and then run this function with those
// as the arguemnts and it's own "success" function as a CB
// https://github.com/jaredhanson/passport-strategy#Strategy+success
// https://github.com/jaredhanson/passport-http/blob/master/lib/passport-http/strategies/basic.js
// I think this then adds the user to the request
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

passport.use('client-basic', new BasicStrategy(
  (username, pw, cb) => {
    Client.findOne({ id: username })
    .then(client => {
      if (!client || client.secret !== pw) return cb(null, false)
      return (null, client)
    })
    .catch(cb)
  }
))

Authenticate.isAuthenticated = passport.authenticate('basic', { session: false })
Authenticate.isCientAuthenticated = passport.authenticate('client-basic', { session: false })
