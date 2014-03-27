/* jshint expr:true */
'use strict';

process.env.DBNAME = 'trapfinder-test';
//var request = require('supertest');
//var app = require('../../app/app');
var expect = require('chai').expect;
var connection;
//var User, inUser;
//var cookie;

var io = require('socket.io-client');

var options ={
  transports: ['websocket'],
  'force new connection': true
};

describe('sockets.js', function(){
  describe('connection', function(){
    it('should emit an "online" message on connection', function(done){
      connection = io.connect('http://localhost:4000/app');
      connection.on('connect', function(){
        connection.on('online', function(data){
          expect(data).to.have.property('date');
          done();
        });
      });
    });
  });

  describe('requestMap', function(){
    it('should emit a newMap message with map array, player number, level, and tmode', function(done){
      connection.emit('requestMap', {level: 1, tmode: true});
      connection.on('newMap', function(data){
        expect(data.map).to.have.length(10);
        expect(data.player).to.equal(1);
        expect(data.level).to.equal(1);
        expect(data.tmode).to.be.true;
        done();
      });
    //  });
    });
  });

  describe('move', function(){
    it('should emit a move message with xv, yv, and player info', function(done){
      connection.emit('move', {xv: 1, yv: 0});
      connection.on('move', function(data){
        expect(data.xv).to.equal(1);
        expect(data.yv).to.equal(0);
        done();
      });
    });
  });

  describe('kill', function(){
    it('should emit a kill message with player info', function(done){
      connection.emit('kill');
      connection.on('kill', function(data){
        expect(data.player).to.equal(1);
        done();
      });
    });
  });

  describe('gameOver', function(){
    it('should emit a gameOver message', function(done){
      connection.emit('gameOver');
      connection.on('gameOver', function(){
        done();
      });
    });
  });

  describe('removeTrap', function(){
    it('should emit a removeTrap message with row and column', function(done){
      var connection2 = io.connect('http://localhost:4000/app', options);
      connection2.on('connect', function(){
        connection.emit('trap', {x: 65, y:65});
        connection2.on('removeTrap', function(data){
          expect(data.row).to.equal(1);
          expect(data.column).to.equal(1);
          done();
        });
      });
    });
  });

  describe('openChest', function(){
    it('should emit an openChest message with row and column', function(done){
      var connection2 = io.connect('http://localhost:4000/app', options);
      connection2.on('connect', function(){
        connection.emit('openChest', {row: 1, column: 1});
        connection2.on('openChest', function(data){
          expect(data.row).to.equal(1);
          expect(data.column).to.equal(1);
          done();
        });
      });
    });
  });

  describe('setWeapon', function(){
    it('should emit an setWeapon message with a src string', function(done){
      var connection2 = io.connect('http://localhost:4000/app', options);
      connection2.on('connect', function(){
        connection.emit('setWeapon', {src: '/img/weapons/a1.png'});
        connection2.on('setWeapon', function(data){
          expect(data.src).to.equal('/img/weapons/a1.png');
          done();
        });
      });
    });
  });

  describe('action kneel', function(){
    it('should emit a kneel with player info when it receives a kneel', function(done){
      var connection2 = io.connect('http://localhost:4000/app', options);
      connection2.emit('action', {direction: 'kneel'});
      connection2.on('action', function(data){
        expect(data.direction).to.equal('kneel');
        expect(data.player).to.equal(1);
        connection2.disconnect();
        connection2 = null;
        done();
      });
    });
  });

  describe('action stop', function(){
    it('should emit a stop with player data when it receives a stop', function(done){
      var connection3 = io.connect('http://localhost:4000/app', options);
      connection3.emit('action', {direction: 'stop'});
      connection3.on('action', function(response){
        expect(response.direction).to.equal('stop');
        expect(response.player).to.equal(1);
        connection3.disconnect();
        connection3 = null;
        done();
      });
    });
  });

  describe('action stop', function(){
    it('should emit an xpos when it receives an xpos', function(done){
      var connection4 = io.connect('http://localhost:4000/app', options);
      connection4.emit('action', {direction: 'xpos', coord: 0});
      connection4.on('action', function(data){
        expect(data.direction).to.equal('xpos');
        expect(data.coord).to.equal(0);
        expect(data.player).to.equal(1);
        connection4.disconnect();
        connection4 = null;
        done();
      });
    });
  });

  describe('action stop', function(){
    it('should emit a ypos when it receives a ypos', function(done){
      connection.emit('action', {direction: 'ypos', coord: 0});
      connection.on('action', function(data){
        expect(data.direction).to.equal('ypos');
        expect(data.coord).to.equal(0);
        expect(data.player).to.equal(1);
        done();
      });
    });
  });

  describe('action stop', function(){
    it('should emit an attack with player data when it receives an attack', function(done){
      connection.emit('action', {direction: 'attack'});
      connection.on('attack', function(data){
        expect(data.player).to.equal(1);
        done();
      });
    });
  });
});
