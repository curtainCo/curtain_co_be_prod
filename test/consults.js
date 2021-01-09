const chai = require('chai');
const { app } = require('../server');
const mongoose = require('mongoose');
const agent = chai.request.agent(app);
const { expect } = chai;
const Consult = require('../models/consult');
const accountRoute = '/api/account';
const consultRoute = '/api/consults';
const userData = require('./test_data/users.json');
const consultData = require('./test_data/consults.json');

let consultId = null;
let consultId2 = null;

const admin = userData.find((user) => user.role === 'admin');
const user = userData.find((user) => user.role === 'user');


const newConsult = {
  email: 'chandler@email',
  title: 'Ms.',
  fullName: 'Chanandler Bong',
  phone: '1234567899',
  address1: '126 Central Perk',
  suburb: 'New York',
  state: 'NSW',
  postcode: '1234',
  message: 'Could this test, BE any easier.'
};


before(done => {
  mongoose.connection.db.dropCollection('consults', () => {
    setUpConsults(consultData, done);
  });
});

after(done => {
  agent.close();
  done();
});

describe('Admin Role Consults Actions', () => {

  // Login as admin
  it('should login as admin', (done) => {
    authUser(admin, 'admin', done);
  });

  // GET all consults
  it('should get all consults as admin', (done) => {
    agent.get(`${consultRoute}/`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('array');
        expect(res).to.have.status(200);
        expect(res.body).to.have.lengthOf(4);
        done();
      });
  });

  // GET one consult
  it('should get one particular consult using ID', (done) => {
    agent.get(`${consultRoute}/${consultId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.email).to.equal('michael@email');
        done();
      });
  });

  // POST one consult
  it('should add one consult', (done) => {
    agent.post(`${consultRoute}`)
      .send(newConsult)
      .then(res => {
        expect(res).to.have.status(201);
      })
      .then(() => {
        agent.get(`${consultRoute}`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(5);
            done();
          });
      });

  });

  // DELETE one consult
  it('should remove one consult', (done) => {
    agent.delete(`${consultRoute}/${consultId}`)
      .then(res => {
        expect(res).to.have.status(202);
        deletedConsult = res.body;
      })
      .then(() => {
        agent.get(`${consultRoute}`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.lengthOf(4);
            expect(res.body).to.not.include(deletedConsult);
            done();
          });
      });
  });

  // ADMIN Logout
  it('should logout', (done) => {
    logOut(done);
  });

});

describe('User Role Consults Actions', () => {

  // Login as user
  it('should login as user', (done) => {
    authUser(user, 'user', done);
  });

  // NOT GET all consults
  it('should NOT have access to all consults', (done) => {
    agent.get(`${consultRoute}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  // NOT GET one consult
  it('should NOT have access to one consult', (done) => {
    agent.get(`${consultRoute}/${consultId2}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  // POST one new consult
  it('should have access to create one consult', (done) => {
    agent.post(`${consultRoute}`)
      .send(newConsult)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // NOT DELETE one new consult
  it('should NOT have access to delete one consult', (done) => {
    agent.delete(`${consultRoute}/${consultId2}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

});


function authUser(user, role, done) {
  agent.post(`${accountRoute}`)
    .type('form')
    .send({
      email: user.email,
      password: user.password
    })
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body.user.role).to.equal(role);
      done();
    });
}

function setUpConsults(consults, done) {
  const promises = [];
  console.log('Consult Data Init');

  for (const consult of consults) {
    promises.push(Consult.create(consult));
  }
  Promise.all(promises)
    .then((consults) => {
      consultId = consults[0]._id;
      consultId2 = consults[1]._id;
      done();
    });
}

function logOut(done) {
  agent.get(`${accountRoute}/logout`)
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(204);
      done();
    });
}