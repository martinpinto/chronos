var acquire = require('acquire'),
    DB = acquire('db').DB;

var Engine = function () {
  this.db = null;
  this.init();
};

Engine.prototype.init = function () {
  var self = this;
  self.db = new DB(); 
};

module.exports.Engine = Engine;