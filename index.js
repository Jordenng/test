const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { getWeatherInsight } = require('./weatherController');

const app = express();
const port = 3000;

const db = new sqlite3.Database('./weather.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the database');

    db.all(`SELECT * FROM weather`, [], (err, rows) => {
      if (err) {
        console.error('Error querying database:', err.message);
      } else {
        console.log('Fetched data:', rows);
      }
    });
  }
});

app.get('/weather/insight', (req, res) => {
  getWeatherInsight(req, res, db);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
