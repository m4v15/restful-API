const Client = require('../models/client')

const clientController = module.exports = {}

clientController.postClients = (req, res) => {
  const client = new Client()

  client.name = req.body.name
  client.id = req.body.id
  client.secret = req.body.secret
  client.userId = req.user._id

  client.save()
  .then(savedClient => res.json({
    message: 'Client added to the locker!',
    data: savedClient
  }))
  .catch(err => res.send(err))
}

clientController.getClients = (req, res) => {
  Client.find({ userId: req.user._id })
  .then(clients => res.json(clients))
  .catch(err => res.send(err))
}
