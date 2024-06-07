const VERY_HOT_THRESHOLD = 30;
const COLD_AND_RAINY_TEMP_THRESHOLD = 10;
const COLD_AND_RAINY_PRECIP_THRESHOLD = 0.5;
const Conditions = {
    VERY_HOT: 'veryHot',
    RAINY_AND_COLD: 'rainyAndCold',
  };
  
  function isConditionMet(condition, row) {
    const isVeryHot = row.Temperature_Celsius > VERY_HOT_THRESHOLD;
    const isColdAndRainy = row.Temperature_Celsius < COLD_AND_RAINY_TEMP_THRESHOLD &&
                           row.Precipitation_Rate_mm_hr > COLD_AND_RAINY_PRECIP_THRESHOLD;
  
    return condition === Conditions.VERY_HOT ? isVeryHot : isColdAndRainy;
  }
  
  function getWeatherInsight(req, res, db) {
    const { lon, lat, condition } = req.query;
    console.log('Received query:', { lon, lat, condition });
    
    if (!lon || !lat || !condition) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }
  
    let conditionQuery;
    if (condition === Conditions.VERY_HOT) {
      conditionQuery = 'Temperature_Celsius > 30';
    } else if (condition === Conditions.RAINY_AND_COLD) {
      conditionQuery = 'Temperature_Celsius < 10 AND Precipitation_Rate_mm_hr > 0.5';
    } else {
      return res.status(400).json({ error: 'Invalid condition' });
    }
  
    const query = `
      SELECT Longitude, Latitude, forecast_time, Temperature_Celsius, Precipitation_Rate_mm_hr
      FROM weather
      WHERE Longitude = ${lon}
      AND Latitude = ${lat}`;
  
    console.log('Executing query:', query);
    
    db.all(query, (err, rows) => {
      if (err) {
        console.error('Error querying database:', err.message);
        return res.status(500).json({ error: err.message });
      }
  
      console.log('Query result:', rows); 
  
      const result = rows.map(row => ({
        forecastTime: row.forecast_time,
        conditionMet: isConditionMet(condition, row)
      }));
  
      console.log('Formatted result:', result); 
  
      res.json(result);
    });
  }
  
  module.exports = { getWeatherInsight };  