const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv-parser');

// Connect to the SQLite database
const db = new sqlite3.Database('./weather.db');
// db.run(`INSERT INTO weather (Longitude, Latitude, forecast_time, Temperature_Celsius, Precipitation_Rate_mm_hr)
//   VALUES (?, ?, ?, ?, ?)`, [-150, 40, '2024-06-01T13:00:00', 5, 1.0], (err) => {
//     if (err) {
//       console.error('Error inserting data:', err.message);
//     } else {
//       console.log('Inserted sample data');
//     }
// });
  
// Read the CSV file and insert data into the database
fs.createReadStream('weather_data.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log('Row:', row); // Log the row object to see its structure (optional)

    db.run(`INSERT INTO weather (Longitude, Latitude, forecast_time, Temperature_Celsius, Precipitation_Rate_mm_hr) VALUES (?, ?, ?, ?, ?)`,
      [
        parseFloat(row.Longitude),
        parseFloat(row.Latitude),
        row.forecast_time,
        parseFloat(row['Temperature_Celsius']),
        parseFloat(row['Precipitation_Rate_mm/hr'])
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
