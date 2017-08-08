// Load required packages
const mongoose = require('mongoose')

// Define our beer schema
const BeerSchema = new mongoose.Schema({
  name: String,
  type: String,
  quantity: Number
})

// Export the Mongoose model
module.exports = mongoose.model('Beer', BeerSchema)