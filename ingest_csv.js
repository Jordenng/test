const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv-parser');

const db = new sqlite3.Database('./weather.db');

fs.createReadStream('weather_data.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log('Row:', row); 

    db.run(`INSERT INTO weather (Longitude, Latitude, forecast_time, Temperature_Celsius, Precipitation_Rate_mm_hr) VALUES (?, ?, ?, ?, ?)`,
      [
        parseFloat(row.Longitude),
        parseFloat(row.Latitude),
        row.forecast_time,
        parseFloat(row['Temperature_Celsius']),
        parseFloat(row['Precipitation_Rate_mm_hr'])
      ],
      (err) => {
        if (err) {
          console.error('Error inserting data:', err.message);
        }
      });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    db.close();
  });