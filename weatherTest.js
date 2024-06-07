const { expect } = require('chai');
const sinon = require('sinon');
const { getWeatherInsight } = require('./weatherController');

describe('getWeatherInsight', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {
        lon: '51.5',
        lat: '24.5',
        condition: 'veryHot'
      }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return weather insights for veryHot condition', () => {
    getWeatherInsight(req, res);

    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.be.an('array');
    // Add more assertions as needed
  });

  it('should return 400 for missing query parameters', () => {
    req.query = {};

    getWeatherInsight(req, res);

    expect(res.status.calledOnceWith(400)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.have.property('error');
    // Add more assertions as needed
  });

  it('should return 400 for invalid condition', () => {
    req.query.condition = 'invalidCondition';

    getWeatherInsight(req, res);

    expect(res.status.calledOnceWith(400)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.have.property('error');
    // Add more assertions as needed
  });

  // Add more tests for other conditions and scenarios
});
