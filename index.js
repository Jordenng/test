const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Connect to the SQLite database
const db = new sqlite3.Database('./weather.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the database');
  }
});

db.all(`SELECT * FROM weather`, [], (err, rows) => {
  if (err) {
    console.error('Error querying database:', err.message);
    return;
  }

  // Log the fetched rows
  console.log('Fetched data:', rows);
});

app.get('/weather/insight', (req, res) => {
  const { lon, lat, condition } = req.query;
  console.log('Received query:', { lon, lat, condition });

  // Add logging here to see the values of lon, lat, and condition

  if (!lon || !lat || !condition) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  let conditionQuery;
  if (condition === 'veryHot') {
    conditionQuery = 'Temperature_Celsius > 30';
  } else if (condition === 'rainyAndCold') {
    conditionQuery = 'Temperature_Celsius < 10 AND Precipitation_Rate_mm_hr > 0.5';
  } else {
    return res.status(400).json({ error: 'Invalid condition' });
  }

  const query = `
    SELECT Longitude, Latitude, forecast_time, Temperature_Celsius, Precipitation_Rate_mm_hr
    FROM weather
    WHERE (${lon})
    AND (${lat})
    AND (${conditionQuery})`;

  console.log('Executing query:', query);

  // Add more logging here to see the constructed query

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error querying database:', err.message);
      return res.status(500).json({ error: err.message });
    }

    console.log('Query result:', rows); // Log the query result

    const result = rows.map(row => ({
      forecastTime: row.forecast_time,
      conditionMet: condition === 'veryHot' ? row.Temperature_Celsius > 30 : row.Temperature_Celsius < 10 && row.Precipitation_Rate_mm_hr > 0.5,
    }));

    console.log('Formatted result:', result); // Log the formatted result

    res.json(result);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// const express = require('express');
// const app = express();
// const port = 3000;

// const db = [
//   {
//     Longitude: 51.5,
//     Latitude: 24.5,
//     forecast_time: '2021-06-01T13:00:00',
//     'Temperature Celsius': 35,
//     'Precipitation Rate mm/hr': 0.2
//   },
//   {
//     Longitude: 51.5,
//     Latitude: 24.5,
//     forecast_time: '2021-06-01T14:00:00',
//     'Temperature Celsius': 36,
//     'Precipitation Rate mm/hr': 0.0
//   }
// ];

// app.get('/weather/insight', (req, res) => {
//   const { lon, lat, condition } = req.query;
//   console.log('Received query:', { lon, lat, condition });

//   if (!lon || !lat || !condition) {
//     return res.status(400).json({ error: 'Missing required query parameters' });
//   }

//   let conditionQuery;
//   if (condition === 'veryHot') {
//     conditionQuery = 'Temperature Celsius > 30';
//   } else if (condition === 'rainyAndCold') {
//     conditionQuery = 'Temperature Celsius < 10 && Precipitation Rate mm/hr > 0.5';
//   } else {
//     return res.status(400).json({ error: 'Invalid condition' });
//   }

//   const filteredData = db.filter(row => {
//     return (
//       parseFloat(row.Longitude) >= parseFloat(lon) - 0.00001 &&
//       parseFloat(row.Longitude) <= parseFloat(lon) + 0.00001 &&
//       parseFloat(row.Latitude) >= parseFloat(lat) - 0.00001 &&
//       parseFloat(row.Latitude) <= parseFloat(lat) + 0.00001
//     );
//   });

//   console.log('Filtered data:', filteredData);

//   const result = filteredData.map(row => ({
//     forecastTime: row.forecast_time,
//     conditionMet: condition === 'veryHot' ? row['Temperature Celsius'] > 30 : row['Temperature Celsius'] < 10 && row['Precipitation Rate mm/hr'] > 0.5,
//   }));

//   res.json(result);
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
