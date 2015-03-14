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
  self.pluginsList = config.pluginsList;
};


EventManager.prototype.preInsert = function (rawEvents, callback) {
  var self = this,
    i = 0,
    plugins = self.pluginsList.map(function (p) {
      return self.plugins[p];
    });

  var preInsert = function () {
    var plugin = plugins[i];
    if (plugin == null) {
      return callback();
    } else {
      var rawLength = rawEvents.length;
      plugin.preInsert(rawEvents, function () {
        if (rawLength !== rawEvents.length) {
          throw Error('Events list length changed ' + plugin);
        }
        i++;
        preInsert();
      });
    }
  };
  preInsert();
};

EventManager.prototype.postInsert = function (events) {
  var self = this;
  for (var i in self.plugins) {
    self.plugins[i].postInsert(Object.clone(events));
  }
};

exports.EventManager = EventManager;