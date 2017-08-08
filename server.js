const express = require('express')

const mongoose = require('mongoose')

const app = express()

const port = process.env.PORT || 4444

const router = express.Router()

// Dummy route for testing
router.get('/', (req, res) => {
  res.json({ msg: 'NO BEER!' })
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
