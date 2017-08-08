const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// Models
const Beer = require('./models/beer')

// Configure App
const app = express()
app.use(bodyParser.urlencoded({extender: true}))
app.use(bodyParser.json({extender: true}))


const port = process.env.PORT || 4444

const router = express.Router()

// Dummy route for testing
router.get('/', (req, res) => {
  res.json({ msg: 'NO BEER!' })
})

// Add beer route
const beersRoute = router.route('/beers')

beersRoute.post((req, res) => {
  const beer = new Beer()
  beer.name = req.body.name
  beer.type = req.body.type
  beer.quantity = req.body.quantity

  beer.save()
  .then(savedBeer => {
    res.json({ msg: 'Beer added', data: savedBeer })
  })
  .catch(err => res.send(err))
})

// register routes on app at /api
app.use('/api', router)

// Configue and connect to db
mongoose.Promise = global.Promise
const dbURI = 'mongodb://localhost:27017/beerlocker'
mongoose.connect(dbURI, { useMongoClient: true })
mongoose.connection.on('error', err => {
  console.log('connection error: ' + err)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected.')
})

mongoose.connection.once('open', () => {
  app.listen(port, err => {
    if (err) {
      throw err
    }
    console.log(`Server listening on port ${port}`)
  })
})
