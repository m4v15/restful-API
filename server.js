const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const ejs = require('ejs')
const beerControllers = require('./controllers/beer')
const userControllers = require('./controllers/user')
const authControllers = require('./controllers/auth')
const clientControllers = require('./controllers/client')
// Configure App
const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({extended: true}))
const port = process.env.PORT || 4444
app.use(passport.initialize())

// view
app.set('view engine', 'ejs')

// Router
const router = express.Router()
// All beers route
router.route('/beers')
      .post(authControllers.isAuthenticated, beerControllers.add)
      .get(authControllers.isAuthenticated, beerControllers.getAll)
// Single beers
router.route('/beers/:beer_id')
      .get(authControllers.isAuthenticated, beerControllers.getOne)
      .put(authControllers.isAuthenticated, beerControllers.update)
      .delete(authControllers.isAuthenticated, beerControllers.remove)
// Users
router.route('/users')
      .get(authControllers.isAuthenticated, userControllers.getAll)
      .post(userControllers.add)
// Clients
router.route('/clients')
      .get(authControllers.isAuthenticated, clientControllers.getClients)
      .post(authControllers.isAuthenticated, clientControllers.postClients)
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
