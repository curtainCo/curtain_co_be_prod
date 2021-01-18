const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../server');
const [adminData, testData] = require('./test_data/auth.json');
const authRoute = "/api/account";

// Configures Chai to make requests
chai.use(chaiHttp);

// Assertion type of use
const { expect } = chai;

// Able to hold sessions
const agent = chai.request.agent(app);

after(done => {
  // CLOSES THE SERVER OPENED BY AGENT-CHAI
  agent.close();
  done();
});

// Register POST route
describe('POST Register Information', () => {


  it('should register new admin with valid credentials', (done) => {
    chai.request(app)
      .post(`${authRoute}/register`)
      .type('form')
      .send(adminData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.an('object');
        expect(res).to.have.status(201);
        done();
      });
  });


  it('should register new user with valid credentials', (done) => {
    chai.request(app)
      .post(`${authRoute}/register`)
      .type('form')
      .send(testData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.an('object');
        expect(res).to.have.status(201);
        done();
      });
  });



  it("should NOT register when EXISTING user", (done) => {
    chai.request(app)
      .post(`${authRoute}/register`)
      .type('form')
      .send(testData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.an('object');
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should NOT register with INVALID fields", (done) => {
    delete testData.email;
    chai.request(app)
      .post(`${authRoute}/register`)
      .type('form')
      .send(testData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.an('object');
        expect(res).to.have.status(400);
        done();
      });
  });
});

// Login POST route
describe('POST Login Information', () => {
  const userCreds = {
    email: "testWrong@email",
    password: "testpassword"
  };


  it("should NOT login with INVALID credentials", (done) => {
    chai.request(app)
      .post(`${authRoute}`)
      .type('form')
      .send(userCreds)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });


  it("should login with valid credentials", (done) => {
    userCreds.email = "testuser@email";
    agent
      .post(`${authRoute}`)
      .type('form')
      .send(userCreds)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.an('object');
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should NOT login when already authenticated", (done) => {
    agent
      .post(`${authRoute}`)
      .type('form')
      .send(userCreds)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.an('object');
        expect(res).to.have.status(401);
        done();
      });
  });
});

// Logout GET route
describe('GET User Logout', () => {
  it("should logout user", (done) => {
    agent
      .get(`${authRoute}/logout`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(204);
        done();
      });
  });

  it("should NOT allow logout if NOT authenticated", (done) => {
    agent
      .get(`${authRoute}/logout`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.an('object');
        expect(res).to.have.status(401);
        done();
      });
  });
});

