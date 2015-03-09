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


EventManager.prototype.preInsert = function (rawEvents) {
  var self = this;
  for (var i in self.plugins) {
    var rawLength = rawEvents.length;
    self.plugins[i].preInsert(rawEvents);
    if (rawLength !== rawEvents.length) {
      throw Error('Events list length changed ' + self.plugins[i]);
    }
  }
};

EventManager.prototype.postInsert = function (events) {
  var self = this;
  for (var i in self.plugins) {
    self.plugins[i].postInsert(Object.clone(events));
  }
};

exports.EventManager = EventManager;