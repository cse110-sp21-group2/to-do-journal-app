import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';

chai.use(chaiHttp);

const email = 'test@testemail.com';
const password = 'testing123';
const name = 'rocky balboa';

let body;
let url;

describe('User Authentication', () => {
  /*
   * Test registering new user.
   */
  describe('Test POST route /auth/signup', () => {
    it('It should POST a new user given email, password and name', (done) => {
      url = `/auth/signup`;

      body = {
        name,
        email,
        password,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('password');
          res.body.data.should.have.property('theme');
          res.body.data.should.have.property('firstDayOfTheWeek');
          res.body.data.should.have.property('term');
          res.body.data.should.have.property('language');

          done();
        });
    });
  });

  /*
   * Test user login
   */
  describe('/POST login', () => {
    it('It should LOG user in ', (done) => {
      url = '/auth/login';

      body = {
        email,
        password,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('password');
          res.body.data.should.have.property('firstDayOfTheWeek');
          res.body.data.should.have.property('term');
          res.body.data.should.have.property('theme');
          res.body.data.should.have.property('language');

          done();
        });
    });
  });

  /*
   * Test forgotten password.
   */
  describe('Test POST route /auth/forgot-password', () => {
    it('It should SEND reset link to user', (done) => {
      url = '/auth/forgot-password';

      const body = {
        email,
      };

      chai
        .request(server)
        .post(url)
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message').eql("We've emailed you a reset link");

          done();
        });
    });
  });
});
