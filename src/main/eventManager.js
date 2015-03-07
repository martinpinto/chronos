var requireDir = require('require-dir'),
      acquire = require('acquire'),
      config = acquire('config');

var EventManager = function () {
  this.dir = [];
  this.init();
};

// class methods
EventManager.prototype.init = function () {
  var self = this;
  self.plugins = requireDir(config.pluginsDir);
};

exports.EventManager = EventManager;