process.env.NODE_ENV = 'test';

const Users = require('../src/models/users.model')

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app')
const { describe, it } = require('mocha')
const passwordHash = require('password-hash')

const should = chai.should();
chai.use(chaiHttp);


describe('/auth', () => {

  describe('Create account', () => {

    // remove the users db
    beforeEach((done) => {
      Users.deleteMany({}, (err) => {
        done();
      });
    });

    it('it should return validation errors', (done) => {
      let user = {
        firstname: "",
        lastname: "",
        email: "james.doe",
        password: "James"
      }
      chai.request(app)
        .post('/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.equal('Invalid fields')
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('firstname');
          res.body.errors.should.have.property('lastname');
          res.body.errors.should.have.property('email');
          res.body.errors.should.have.property('password');
          res.body.errors.should.have.property('cpassword');
          done();
        });
    });

    it('it should return user already exist error', (done) => {
      let user = {
        firstname: "James",
        lastname: "Doe",
        email: "james.doe@example.com",
        password: "1#James",
        cpassword: "1#James"
      }

      Users.create({
        firstname: "James",
        lastname: "Doe",
        email: "james.doe@example.com",
        password: "1#James"
      }).then(_ => {
        chai.request(app)
          .post('/auth/register')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.equal('Invalid fields')
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('email');
            res.body.errors.email.should.be.a('array')
            res.body.errors.email[0].should.equal('User with email already exists.');
            done();
          });
      })

    });

    it('it should successfully create a user account', (done) => {
      let user = {
        firstname: "James",
        lastname: "Doe",
        email: "james.doe@example.com",
        password: "1#James",
        cpassword: "1#James"
      }
      chai.request(app)
        .post('/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.equal('Account created.')
          res.body.should.have.property('data');
          res.body.data.should.have.property('authToken');
          res.body.data.should.have.property('user');
          done();
        });
    });

  });

  describe('Login', () => {

    // remove the users db and add a new user
    beforeEach((done) => {
      Users.deleteMany({}, (err) => {
        Users.create({
          firstname: "James",
          lastname: "Doe",
          email: "james.doe@example.com",
          password: passwordHash.generate("1#James")
        }).then(_ => done())
      });
    });

    it('it should return login error', (done) => {
      let user = {
        email: "james.doe@example.com",
        password: "1James"
      }
      chai.request(app)
        .post('/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.equal('Invalid email / password.')
          done();
        });
    });

    it('it should successfully log a user in', (done) => {
      let user = {
        email: "james.doe@example.com",
        password: "1#James",
      }
      chai.request(app)
        .post('/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.equal('Login successful')
          res.body.should.have.property('data');
          res.body.data.should.have.property('authToken');
          res.body.data.should.have.property('user');
          done();
        });
    });

  })


})

