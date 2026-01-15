CREATE TABLE IF NOT EXISTS riders (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  mobile TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bikes (
  id SERIAL PRIMARY KEY,
  bike_code TEXT UNIQUE NOT NULL,
  model TEXT NOT NULL,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bike_assignments (
  id SERIAL PRIMARY KEY,
  rider_id INT REFERENCES riders(id) ON DELETE CASCADE,
  bike_id INT REFERENCES bikes(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT TRUE
);

ALTER TABLE riders
ADD COLUMN total_earnings NUMERIC DEFAULT 0;

ALTER TABLE riders
ADD COLUMN last_earnings_date DATE;

CREATE TABLE rider_daily_earnings (
  id SERIAL PRIMARY KEY,
  rider_id INTEGER REFERENCES riders(id),
  earning_date DATE NOT NULL,
  daily_earnings NUMERIC DEFAULT 0,
  UNIQUE (rider_id, earning_date)
);

CREATE TABLE IF NOT EXISTS rider_daily_activity (
  id SERIAL PRIMARY KEY,

  rider_id INTEGER NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  mobile TEXT NOT NULL,

  earning_date DATE NOT NULL,
  daily_earnings NUMERIC DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (rider_id, earning_date)
);


