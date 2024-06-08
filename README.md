## Render URL
https://test-wkzw.onrender.com

## Example
https://test-wkzw.onrender.com/weather/insight?lon=-180&lat=-90&condition=veryHot

## Optimization And Pitfalls
### Tests 
Should be more, and more precise 
### Index.js File
Should be as minimal as possible, connection to DB could be made in another file, improve readability
### SQL Injection
SQL injection risk with inserting values in the query
### No magic numbers
values such as 30, 0.5, and 10 should be constants
### Index
If the data is large, querying on 'Longitude' and 'Latitude' could take some time, can be done with indexes to improve performance

## Production
To make this production-grade, security should be improved (risk of SQL Injection), optimized data queries, documentation for the API, and deployment strategy 
