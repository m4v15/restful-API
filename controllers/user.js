const User = require('../models/user')

const UserController = {}

module.exports = UserController

UserController.add = (req, res) => {
  const user = new User(req.body)

  user.save()
  .then(res.json({ message: 'New beer drinker added' }))
  .catch(res.send)
}

UserController.getAll = (req, res) => {
  User.find()
  .then(users => res.json(users))
  .catch(res.send)
}
