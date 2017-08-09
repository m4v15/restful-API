const Beer = require('../models/beer')

const beerControllers = {}

module.exports = beerControllers

beerControllers.add = (req, res) => {
  const beer = new Beer()
  beer.name = req.body.name
  beer.type = req.body.type
  beer.quantity = req.body.quantity

  beer.save()
  .then(savedBeer => {
    res.json({ msg: 'Beer added', data: savedBeer })
  })
  .catch(err => res.send(err))
}

beerControllers.getAll = (req, res) => {
  Beer.find({})
  .then(beers => res.json(beers))
  .catch(err => res.send(err))
}

beerControllers.getOne = (req, res) => {
  Beer.findById(req.params.beer_id)
  .then(beer => res.json(beer))
  .catch(err => res.send(err))
}

beerControllers.update = (req, res) => {
  Beer.findById(req.params.beer_id)
  .then(beer => {
    beer.quantity = req.body.quantity
    beer.save()
    .then(beer => res.json(beer))
    .catch(err => res.send(err))
  })
  .catch(err => res.send(err))
}

beerControllers.remove = (req, res) => {
  Beer.findByIdAndRemove(req.params.beer_id)
  .then(() => res.json({ msg: 'Beer removed' }))
  .catch(err => res.send(err))
}
