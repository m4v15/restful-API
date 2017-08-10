// Load required packages
const oauth2orize = require('oauth2orize')
const User = require('../models/user')
const Client = require('../models/client')
const Token = require('../models/token')
const Code = require('../models/code')

const server = oauth2orize.createServer()

// Util functions
const uid = (len) => {
  let buf = []
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charlen = chars.length

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)])
  }

  return buf.join('')
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
//

// Register serialialization function
server.serializeClient(function (client, callback) {
  return callback(null, client._id)
})

// Register deserialization function
server.deserializeClient(function (id, callback) {
  Client.findOne({ _id: id }, function (err, client) {
    if (err) { return callback(err) }
    return callback(null, client)
  })
})

server.grant(oauth2orize.grant.code((client, redirectUri, user, ares, cb) => {
  const code = new Code({
    value: uid(16),
    clientId: client._id,
    redirectUri,
    userId: user._id
  })
  code.save()
  .then(savedCode => cb(null, savedCode.value))
  .catch(cb)
}))

server.exchange(oauth2orize.exchange.code((client, code, redirectUri, cb) => {
  Code.findOne({ value: code })
  .then(authCode => {
    if (authCode === undefined) return cb(null, false)
    if (client._id.toString() !== authCode.clientId) cb(null, false)
    if (redirectUri !== authCode.redirectUri) return cb(null, false)

    authCode.remove()
    .then(() => {
      const token = new Token({
        value: uid(256),
        clientId: authCode.clientId,
        userId: authCode.userId
      })

      token.save()
      .then(savedToken => cb(null, token))
      .catch(cb)
    })
    .catch(cb)
  })
  .catch(cb)
}))

module.exports = {}
module.exports.authorization = [
  server.authorization((clientId, redirectUri, cb) => {
    Client.findOne({ id: clientId })
    .then(client => cb(null, client, redirectUri))
    .catch(cb)
  }),
  (req, res) => res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client })
]

module.exports.decision = [ server.decision() ]

module.exports.token = [
  server.token(),
  server.errorHandler()
]
