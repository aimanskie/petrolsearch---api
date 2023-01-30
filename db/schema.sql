CREATE DATABASE melbourne_map;

CREATE TABLE petrol_stations (
   id SERIAL PRIMARY KEY,
   name TEXT,
   owner TEXT,
   address TEXT,
   suburb TEXT,
   state TEXT,
   latitude Decimal,
   longtitude Decimal
);