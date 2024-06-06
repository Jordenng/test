const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Adjust the path to your app.js file
const sqlite3 = require('sqlite3').verbose();
const { expect } = chai;

chai.use(chaiHttp);

describe('Weather Insight API', () => {
  let db;

  before((done) => {
    // Connect to the SQLite database
    db = new sqlite3.Database('./weather.db', (err) => {
      if (err) {
        console.error('Error connecting to database:', err.message);
      } else {
        console.log('Connected to the database for testing');
      }
      done();
    });
  });

  after((done) => {
    // Close the database connection after tests
    db.close((err) => {
      if (err) {
        console.error('Error closing the database:', err.message);
      }
      done();
    });
  });

  describe('GET /weather/insight', () => {
    it('should return weather insights for veryHot condition', (done) => {
      chai.request(app)
        .get('/weather/insight')
        .query({ lon: '51.5', lat: '24.5', condition: 'veryHot' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          res.body.forEach(item => {
            expect(item).to.have.property('forecastTime');
            expect(item).to.have.property('conditionMet').that.is.a('boolean');
          });
          done();
        });
    });

    it('should return 400 for missing query parameters', (done) => {
      chai.request(app)
        .get('/weather/insight')
        .query({ lon: '51.5', lat: '24.5' }) // Missing condition parameter
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should return 400 for invalid condition', (done) => {
      chai.request(app)
        .get('/weather/insight')
        .query({ lon: '51.5', lat: '24.5', condition: 'unknownCondition' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
});