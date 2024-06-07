// test for cold condition
// test for lon is not in db returns empty array
// test for lat is not in db returns empty array
// fix tests expect to match reality.

import { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import pkg from './db.js';
const { db } = pkg;
import { getWeatherInsight } from './weatherController.js';

chai.use(chaiHttp);

describe('Weather Insight API', () => {
  let server;

  before((done) => {
    server = app.listen(3000, done);
  });

  after((done) => {
    server.close(done);
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
