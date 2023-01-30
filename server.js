const express = require('express')
const app = express()
const config = require('./config')
const PetrolStation = require('./models/PetrolStation')

app.use(express.static('public'))

app.get('/api/stations/all', (req, res) => {
  PetrolStation.getAllStation().then((data) => {
    res.status(200).json(data)
  })
})

app.get('/api/stations/random', (req, res) => {
  PetrolStation.getOneByRandom().then((data) => {
    res.status(200).json(data)
  })
})

app.get('/api/stats', (req, res) => {
  PetrolStation.getStats().then(({ count, totalStations }) => {
    res.status(200).json({ totalByOwner: count, total: totalStations })
  })
})

app.get('/api/stations/nearest', (req, res) => {
  const { lat, lng, radius } = req.query
  PetrolStation.getNearestStation(lat, lng, radius).then((data) => {
    res.status(200).json(data)
  })
})

app.listen(config.port)
