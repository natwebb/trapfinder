'use strict';

exports.singleplayer = function(req, res){
  res.render('game/index');
};

exports.multiplayer = function(req, res){
  res.render('game/index2');
};
