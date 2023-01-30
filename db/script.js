const db = require("../db")
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

fs.createReadStream(path.resolve(__dirname, "./PetrolStations_v1.csv"))
  .pipe(csv())
  .on("data", (row) => {
    const sql = `INSERT INTO petrol_stations (name, owner, address, suburb, state, latitude, longtitude) VALUES ($1, $2, $3, $4, $5, $6, $7);`;
    const { NAME, OWNER, ADDRESS, SUBURB, STATE, LATITUDE, LONGITUDE } = row;
    db.query(sql, [NAME, OWNER, ADDRESS, SUBURB, STATE, LATITUDE, LONGITUDE]);
  })
  .on("end", () => {
    console.log("CSV successfully added to database")
  });
