// Load required packages
var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

// Define our user schema
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

const updatePwHasher = function (next) {
  const user = this

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(5)
  .then(salt => {
    bcrypt.hash(user.password, salt)
    .then(hash => {
      user.password = hash
      next()
    })
    .catch(next)
  })
  .catch(next)
}

UserSchema.pre('save', updatePwHasher)

module.exports = mongoose.model('User', UserSchema)
