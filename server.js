const express = require('express')

const app = express()

const port = process.env.PORT || 4444

const router = express.Router()

// Dummy route for testing

router.get('/', (req, res) => {
  res.json({ msg: 'NO BEER!' })
})
