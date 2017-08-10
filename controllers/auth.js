const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const BearerStrategy = require('passport-http-bearer').Strategy

const User = require('../models/user')
const Client = require('../models/client')
const Token = require('../models/token')

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
      return cb(null, client)
    })
    .catch(cb)
  }
))

passport.use(new BearerStrategy(
  (accessToken, cb) => {
    Token.findOne({ value: accessToken })
    .then(token => {
      if (!token) return cb(null, false)
      User.findOne({ _id: token.userId })
      .then(user => {
        if (!user) return cb(null, false)
        cb(null, user, { scope: '*' })
      })
      .catch(cb)
    })
    .catch(cb)
  }
))

Authenticate.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session: false })
Authenticate.isClientAuthenticated = passport.authenticate('client-basic', { session: false })
