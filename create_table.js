const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./weather.db');

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS weather`, (err) => {
    if (err) {
      console.error('Error dropping table:', err.message);
    } else {
      console.log('Table dropped');
    }
  });
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS weather (
    id INTEGER PRIMARY KEY,
    Longitude REAL,
    Latitude REAL,
    forecast_time TEXT,
    Temperature_Celsius REAL,
    Precipitation_Rate_mm_hr REAL
  )`, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table created');
    }
  });
});

db.all(`PRAGMA table_info(weather);`, (err, rows) => {
  if (err) {
    console.error('Error querying table info:', err.message);
    return;
  }
  console.log('Columns:', rows.map(row => row.name));
});

db.close();