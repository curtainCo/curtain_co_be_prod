const chai = require('chai');
const { app } = require('../server');
const mongoose = require('mongoose');
const { s3 } = require('../config/file_upload');
const agent = chai.request.agent(app);
const { expect } = chai;
const { Product } = require('../models/product');
const accountRoute = '/api/account';
const productRoute = '/api/products';
const userData = require('./test_data/users.json');
const productData = require('./test_data/products.json');

let productId = null;
let productId2 = null;
let imgKey = null;

const admin = userData.find(user => user.role === 'admin');
const user = userData.find(user => user.role === 'user');

const newProduct = {
  name: 'Awesome Fabric',
  colour: 'Magenta',
  category: 'Fabric',
  density: 'Thicc',
  style: 'Nice',
  size: 'Big',
  length: 'Long'
};

before(done => {
  mongoose.connection.db.dropCollection('products', () => {
    setUpProducts(productData, done);
  });
});

after(done => {
  // deletes the recently added image on AWS bucket to clean up after all the tests
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

describe('Admin Role Products Actions', () => {

  // Login as admin
  it('should login as admin', (done) => {
    authUser(admin, 'admin', done);
  });

  // GET all products
  it('should get all products as admin', (done) => {
    agent.get(`${productRoute}/`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('array');
        expect(res).to.have.status(200);
        expect(res.body).to.have.lengthOf(7);
        done();
      });
  });

  // GET single product
  it('should get one particular product using ID', (done) => {
    agent.get(`${productRoute}/${productId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal('Series 51 White Track');
        done();
      });
  });

  // POST new product
  it('should add one product', (done) => {
    agent.post('/api/upload')
      .set('Content-Type', "multipart/form-data")
      .attach('image', 'test/test_data/test_image.png')
      .then(res => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        newProduct.imgUrl = res.body.image.location;
        imgKey = res.body.image.key;
      })
      .then(() => {
        agent.post(`${productRoute}/`)
          .send(newProduct)
          .type('form')
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body.name).to.equal('Awesome Fabric');
            done();
          });
      });
  });

  // PUT existing product
  it('should update one product', (done) => {
    const product1 = {
      category: 'Track',
      name: 'Series 52 Black Rod',
      type: "Powder Coated",
      single: true,
      finialStyle: "Colonial",
      finialColour: "White",
      location: "Ceiling",
      price: 999
    };
    agent.put(`${productRoute}/${productId}`)
      .send(product1)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.name).to.equal(product1.name);
        done();
      });
  });

  // DELETE one product
  it('should delete one product', (done) => {
    agent.delete(`${productRoute}/${productId}`)
      .then(res => {
        expect(res).to.have.status(202);
        deletedProduct = res.body;
      })
      .then(() => {
        agent.get(`${productRoute}`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.lengthOf(7);
            expect(res.body).to.not.include(deletedProduct);
            done();
          });
      });
  });

  // Logout as admin
  it('should logout as admin', (done) => {
    logOut(done);
  });

});

describe('User Role Products Actions', () => {

  // Login as user
  it('should login as user', (done) => {
    authUser(user, 'user', done);
  });

  // GET all products
  it('should get all products as user', (done) => {
    agent.get(`${productRoute}/`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('array');
        expect(res).to.have.status(200);
        expect(res.body).to.have.lengthOf(7);
        done();
      });
  });

  // GET single product
  it('should get one particular product using ID', (done) => {
    agent.get(`${productRoute}/${productId2}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal('Linia Modesta');
        done();
      });
  });

  // NOT POST new product
  it('should NOT have access to add new product', (done) => {
    agent.post(`${productRoute}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  // NOT PUT existing product
  it('should NOT have access to update one product', (done) => {
    agent.put(`${productRoute}/${productId2}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  // NOT DELETE one product
  it('should NOT have access to delete one product', (done) => {
    agent.delete(`${productRoute}/${productId2}`)
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

function setUpProducts(products, done) {
  const promises = [];
  console.log('Product Data Init');

  for (const product of products) {
    promises.push(Product.create(product));
  }
  Promise.all(promises)
    .then((product) => {
      productId = product[0]._id;
      productId2 = product[1]._id;
      done();
    });
}

function logOut(done) {
  agent.get(`${accountRoute}/logout`)
    .then(() => {
      done();
    });
}