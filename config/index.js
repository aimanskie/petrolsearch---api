const dev = {
  port: 8080,
  db: {
    database: 'melbourne_map'
  }
}

const production = {
  port: process.env.PORT,
  // database: process.env.DATABASE_URL
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}

module.exports = process.env.NODE_ENV === 'production'
  ? production
  : dev