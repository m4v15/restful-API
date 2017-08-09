const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const beerControllers = require('./controllers/beer')

// Configure App
const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({extended: true}))
const port = process.env.PORT || 4444

// Router
const router = express.Router()
// All beers route
router.route('/beers')
      .post(beerControllers.add)
      .get(beerControllers.getAll)
// Single beers
router.route('/beers/:beer_id')
      .get(beerControllers.getOne)
      .put(beerControllers.update)
      .delete(beerControllers.remove)
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
