/* jshint expr:true */
'use strict';

process.env.DBNAME = 'nodemon-test';
var request = require('supertest');
var app = require('../../app/app');
var expect = require('chai').expect;
var User, inUser;
//var cookie;

describe('user', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      inUser = new User({name:'Nat', email:'nat@nomail.com', password:'1234'});
      inUser.register(function(){
        done();
      });
    });
  });

  describe('GET /', function(){
    it('should display the home page', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });

  describe('POST /register', function(){
    it('should allow a user to register', function(done){
      request(app)
      .post('/register')
      .field('name', 'Kessel')
      .field('email', 'kessel@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });

    it('should not allow a duplicate email to register', function(done){
      request(app)
      .post('/register')
      .field('name', 'Nat')
      .field('email', 'nat@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.body.success).to.be.false;
        done();
      });
    });
  });

  describe('POST /login', function(){
    it('should login a new user', function(done){
      request(app)
      .post('/login')
      .field('email', 'nat@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.text).to.equal('Moved Temporarily. Redirecting to /');
        done();
      });
    });

    it('should not login a wrong user by email', function(done){
      request(app)
      .post('/login')
      .field('email', 'wrong@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.body.success).to.be.false;
        done();
      });
    });

    it('should not login a wrong user by password', function(done){
      request(app)
      .post('/login')
      .field('email', 'nat@nomail.com')
      .field('password', '12234')
      .end(function(err, res){
        expect(res.body.success).to.be.false;
        done();
      });
    });
  });

  describe('POST /logout', function(){
    it('should log a user out of the app', function(done){
      request(app)
      .post('/logout')
      .expect(302, done);
    });
  });

  describe('GET /users/:id', function(){
    it('should redirect to the show page', function(done){
      request(app)
      .get('/users/'+ inUser._id)
      .expect(200, done);
    });
  });
});