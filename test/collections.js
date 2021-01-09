// TODO - save products, extract id, assign to collection then save to
// test db to proceed with the tests.
const chai = require('chai');
const { app } = require('../server');
const mongoose = require('mongoose');
const { s3 } = require('../config/file_upload');
const agent = chai.request.agent(app);
const { expect } = chai;
const { Collection } = require('../models/collection');
const { Product } = require('../models/product');
const accountRoute = '/api/account';
const collectionRoute = '/api/collections';
const userData = require('./test_data/users.json');
const collectionData = require('./test_data/collections.json');

let collectionId = null;
let collectionId2 = null;
let imgKey = null;

const admin = userData.find(user => user.role === 'admin');
const user = userData.find(user => user.role === 'user');

const newCollection = {
  name: "Test Collection",
  description: "Collection for testing purposes.",
  price: 9999,
  track: null,
  fabric: null,
  accessory: null
};

before(done => {
  mongoose.connection.db.dropCollection('collections', () => {
    getAndAssignProductByCategory('Track', newCollection);
    getAndAssignProductByCategory('Fabric', newCollection);
    getAndAssignProductByCategory('Accessory', newCollection);
    setUpCollections(collectionData, done);
  });
});

after(done => {
  // deletes the recently added image on AWS bucket to clean up after all the tests;
  const s3Params = {
    Bucket: 'the-curtain-co',
    Key: imgKey
  };
  s3.deleteObject(s3Params, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log('Removed Data:', data);
    agent.close();
    done();
  });
});

describe('Admin Role Collections Actions', () => {
  // Login as admin
  it('should login as admin', (done) => {
    authUser(admin, 'admin', done);
  });

  // GET all collections
  it('should get all collections as admin', (done) => {
    agent.get(`${collectionRoute}/`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('array');
        expect(res).to.have.status(200);
        expect(res.body).to.have.lengthOf(2);
        done();
      });
  });

  // GET single collection
  it('should get one particular collection using ID', (done) => {
    agent.get(`${collectionRoute}/${collectionId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal('Summer Breeze');
        done();
      });
  });

  // POST new collection
  it('should add one product', (done) => {
    agent.post('/api/upload')
      .set('Content-Type', "multipart/form-data")
      .attach('image', 'test/test_data/test_image.png')
      .then(res => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        newCollection.imgUrl = res.body.image.location;
        imgKey = res.body.image.key;
      })
      .then(() => {
        agent.post(`${collectionRoute}/`)
          .send(newCollection)
          .type('form')
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body.name).to.equal('Test Collection');
            done();
          });
      });
  });

  // PUT existing collection
  it('should update one collection', (done) => {
    const collection1 = {
      name: "Updated Summer Breeze",
      description: "Updated Collection for testing purposes.",
      price: 999
    };
    agent.put(`${collectionRoute}/${collectionId}`)
      .send(collection1)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.name).to.equal(collection1.name);
        done();
      });
  });

  // DELETE one collection
  it('should delete one product', (done) => {
    agent.delete(`${collectionRoute}/${collectionId}`)
      .then(res => {
        expect(res).to.have.status(202);
        deletedCollection = res.body;
      })
      .then(() => {
        agent.get(`${collectionRoute}`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.lengthOf(2);
            expect(res.body).to.not.include(deletedCollection);
            done();
          });
      });
  });

  // Logout as admin
  it('should logout as admin', (done) => {
    logOut(done);
  });
});

describe('User Role Collection Actions', () => {

  // Login as user
  it('should login as user', (done) => {
    authUser(user, 'user', done);
  });

  // GET all collections
  it('should get all collections as user', (done) => {
    agent.get(`${collectionRoute}/`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('array');
        expect(res).to.have.status(200);
        expect(res.body).to.have.lengthOf(2);
        done();
      });
  });

  // GET single collection
  it('should get one particular collection using ID', (done) => {
    agent.get(`${collectionRoute}/${collectionId2}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal('Winter Breeze');
        done();
      });
  });

  // NOT POST new collection
  it('should NOT have access to add new collection', (done) => {
    agent.post(`${collectionRoute}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  // NOT PUT existing collection
  it('should NOT have access to update one collection', (done) => {
    agent.put(`${collectionRoute}/${collectionId2}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  // NOT DELETE one collection
  it('should NOT have access to delete one collection', (done) => {
    agent.delete(`${collectionRoute}/${collectionId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

});

// Assign objects to newCollectionCategory variable
function getAndAssignProductByCategory(cat, collection) {
  Product.findOne({ category: cat })
    .then(res => {
      switch (cat) {
        case 'Track':
          collection.track = new Array(res);
          break;
        case 'Fabric':
          collection.fabric = new Array(res);
          break;
        default:
          collection.accessory = new Array(res);
          break;
      }
    });
};

function setUpCollections(collections, done) {
  const promises = [];
  console.log('Collection Data Init');

  // finds a Track, Fabric & Accessory to be put
  // in a collection prior to creation
  for (const collection of collections) {
    getAndAssignProductByCategory('Track', collection);
    getAndAssignProductByCategory('Fabric', collection);
    getAndAssignProductByCategory('Accessory', collection);
    promises.push(Collection.create(collection));
  }
  Promise.all(promises)
    .then((collection) => {
      collectionId = collection[0]._id;
      collectionId2 = collection[1]._id;
      done();
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