const app = require('./index.js');
const monk = require('monk');
const wrap = require('co-monk');
const db = monk('localhost/donation');
const donations = wrap(db.get('donations'));

var request = require('supertest').agent(app.listen());

describe('Donations', () => {
    it('submits a new donation', function (done) {
        request
            .post('/donate')
            .send({amount: 200, currency: "USD"})
            .expect(201)
            .end(done);
    });
    it('validates amount', function (done) {
        request
            .post('/donate')
            .send({amount: -5, currency: "USD"})
            .expect(400)
            .end(done);
    });
    it('validates currency', function (done) {
        request
            .post('/donate')
            .send({amount: 150, currency: "CHF"})
            .expect(400)
            .end(done);
    });
});
