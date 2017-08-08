const express = require('express')

const app = express()

const port = process.env.PORT || 4444

const router = express.Router()

// Dummy route for testing

router.get('/', (req, res) => {
  res.json({ msg: 'NO BEER!' })
})

//register routes on app at /api

app.use('/api', router)

app.listen(port)

console.log('Server listening on port ', port)