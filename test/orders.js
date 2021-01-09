const chai = require('chai');
const { app } = require('../server');
const mongoose = require('mongoose');
const agent = chai.request.agent(app);
const Order = require('../models/order');
const { expect } = chai;
const accountRoute = '/api/account';
const orderRoute = '/api/orders';
const userData = require('./test_data/users.json');
const ordersData = require('./test_data/orders.json');

// Needs to login before seeding test database for customer attribute

let orderId = null;

const admin = userData.find(user => user.role === 'admin');
const user = userData.find(user => user.role === 'user');

const newOrder = {
  "_id": "PAYPAL_ID_NEW",
  "items": [
    {
      "name": "Bracket Covers",
      "colour": "Brass",
      "price": 99,
      "category": "Accessory",
      "type": "Other",
      "imgUrl": "www.someimage.com",
      "description": "Test Accessory"
    }
  ],
  "totalPrice": 99,
  "paymentData": {
    "paymentId": "Sample Paypal ID"
  }
};



before(done => {
  mongoose.connection.db.dropCollection('orders', () => {
    // login as user for order data seeding
    agent.post(`${accountRoute}`)
      .type('form')
      .send({
        email: user.email,
        password: user.password
      })
      .end((err, res) => {
        const { user } = res.body;
        setUpOrders(ordersData, user)
          .then(() => {
            logOut(done);
          });
      });
  });
});

after(done => {
  agent.close();
  done();
});

describe('Admin Role Order Actions', () => {

  // Login as admin
  it('should login as admin', (done) => {
    authUser(admin, 'admin', done);
  });

  // GET all orders
  it('should get all orders as admin', (done) => {
    agent.get(`${orderRoute}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('array');
        expect(res).to.have.status(200);
        expect(res.body).to.have.lengthOf(3);
        done();
      });
  });

  // GET single order
  it('should get one particular order using ID', (done) => {
    agent.get(`${orderRoute}/${orderId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.equal('PAYPAL_ID01');
        done();
      });
  });


  // PATCH existing order
  it('should update one order', (done) => {
    const order1 = {
      isProcessed: true
    };
    agent.patch(`${orderRoute}/${orderId}`)
      .send(order1)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.isProcessed).to.be.true;
        done();
      });
  });

  // Logout as admin
  it('should logout as admin', (done) => {
    logOut(done);
  });
});

describe('User Role Orders Actions', () => {

  // Login as user
  it('should login as user', (done) => {
    authUser(user, 'user', done);
  });

  // NOT GET all orders
  it('should NOT have access to get all orders', (done) => {
    agent.get(`${orderRoute}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  // NOT GET single order
  it('should NOT have access to get one order', (done) => {
    agent.get(`${orderRoute}/${orderId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  // POST new order
  it('should add one order', (done) => {
    agent.post(`${orderRoute}/`)
      .send(newOrder)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.equal('PAYPAL_ID_NEW');
        done();
      });
  });


  // NOT PATCH existing order
  it('should NOT have access to update one order', (done) => {
    agent.patch(`${orderRoute}/${orderId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });
});

function setUpOrders(orders, user) {
  const promises = [];
  console.log('Order Data Init');

  for (const order of orders) {
    order.customer = user._id;
    promises.push(Order.create(order));
  }
  return Promise.all(promises)
    .then((order) => {
      orderId = order[0]._id;
    });
}

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

function logOut(done) {
  agent.get(`${accountRoute}/logout`)
    .then(() => {
      done();
    });
}