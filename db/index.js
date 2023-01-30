const { Pool } = require("pg");
const config = require("../config");
const db = new Pool(config.db);

module.exports = db;
