/* jshint expr:true */
'use strict';

process.env.DBNAME = 'trapfinder-test';
var request = require('supertest');
var app = require('../../app/app');
//var expect = require('chai').expect;
var User, inUser;
var cookie;

describe('home', function(){

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

  describe('GET /about', function(){
    it('should display the about page', function(done){
      request(app)
      .get('/about')
      .expect(200, done);
    });
  });

  describe('AUTHORIZED', function(){
    beforeEach(function(done){
      request(app)
      .post('/login')
      .field('email', 'nat@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'];
        done();
      });
    });

    describe('GET /alone', function(){
      it('should get the single-player game', function(done){
        request(app)
        .get('/alone')
        .set('cookie', cookie)
        .expect(200, done);
      });
    });

    describe('GET /notalone', function(){
      it('should get the multiplayer game', function(done){
        request(app)
        .get('/notalone')
        .set('cookie', cookie)
        .expect(200, done);
      });
    });
  });
});
