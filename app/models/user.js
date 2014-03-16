'use strict';

module.exports = User;
var bcrypt = require('bcrypt');
var users = global.nss.db.collection('users');
var Mongo = require('mongodb');

/* ---------------------------------- *
 * User
 * _id
 * email
 * password
 * role
 *
 * #register
 * .findByEmailAndPassword
 * ---------------------------------- */

function User(user){
  this.name = user.name;
  this.email = user.email;
  this.password = user.password;
  this.lastLogin = new Date();
}

User.prototype.register = function(fn){
  var self = this;

  hashPassword(self.password, function(hashedPwd){
    self.password = hashedPwd;
    insert(self, function(err){
      if(self._id){
        fn(err);
      }else{
        fn();
      }
    });
  });
};

User.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  users.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

User.findByEmailAndPassword = function(email, password, fn){
  users.findOne({email:email}, function(err, user){
    if(user){
      bcrypt.compare(password, user.password, function(err, result){
        if(result){
          fn(user);
        }else{
          fn();
        }
      });
    }else{
      fn();
    }
  });
};

function insert(user, fn){
  users.findOne({email:user.email}, function(err, emailFound){
    if(!emailFound){
      users.findOne({name:user.name}, function(err, userNameFound){
        if(!userNameFound){
          users.insert(user, function(err, record){
            fn(err);
          });
        }else{
          fn();
        }
      });
    }else{
      fn();
    }
  });
}

function update(user, fn){
  users.update({_id:user._id}, user, function(err, count){
    fn(err);
  });
}

function hashPassword(password, fn){
  bcrypt.hash(password, 8, function(err, hash){
    fn(hash);
  });
}

User.prototype.setHome = function(lat, lng, fn){
  this.home = [parseFloat(lat), parseFloat(lng)];
  update(this, function(err){
    fn(err);
  });
};

User.findAll = function(fn){
  users.find().toArray(function(err, records){
    fn(records);
  });
};

User.findByName = function(name, fn){
  users.findOne({name:name}, function(err, record){
    fn(record);
  });
};

User.deleteById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  users.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

