const db = require('../db')
const distance = require('gps-distance')
class PetrolStation {
  static getAllStation() {
    const sql = `SELECT * FROM petrol_stations ORDER BY id ASC LIMIT 5000;`
    return db.query(sql).then((data) => data)
  }

  static getOneByRandom() {
    const sql = `SELECT * FROM petrol_stations ORDER BY RANDOM() LIMIT 1;`
    return db.query(sql).then((data) => data.rows[0])
  }

  static getStats() {
    const sql = `SELECT owner FROM petrol_stations;`
    return db.query(sql).then((data) => {
      const totalStations = data.rows.length
      const count = Object.entries(
        data.rows.reduce((tally, row) => {
          tally[row.owner] = (tally[row.owner] || 0) + 1
          return tally
        }, {})
      )
        .filter(([_, count]) => count > 1)
        .map(([owner, count]) => ({ owner: owner, total: count }))
        .sort((a, b) => b.total - a.total)

      return { count, totalStations }
    })
  }

  static getNearestStation(latitude, longitude, radius) {
    const sql = 'SELECT * FROM petrol_stations'
    return db.query(sql).then((data) => {
      const nearestStation = data.rows
        .map((station) => ({
          ...station,
          distance: distance(Number(latitude), Number(longitude), Number(station.latitude), Number(station.longtitude)),
        }))
        .sort((a, b) => a.distance - b.distance)
        .filter((station, index) => station.distance < radius && index < 700)
      return nearestStation
    })
  }

  static getStationOwner(owner, latitude, longitude, radius) {
    const sql = 'SELECT * FROM petrol_stations where owner = $1;'
    return db.query(sql, [owner]).then((data) => {
      const ownerStation = data.rows
        .map((station) => ({
          ...station,
          distance: distance(Number(latitude), Number(longitude), Number(station.latitude), Number(station.longtitude)),
        }))
        .sort((a, b) => a.distance - b.distance)
        .filter((station, index) => station.distance < radius && index < 50)
      return ownerStation
    })
  }
}

module.exports = PetrolStation
