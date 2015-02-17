var acquire = require('acquire'),
  DB = acquire('db').DB,
  event = acquire('event');

var Engine = function () {
  this.db = null;
  this.init();
};

Engine.prototype.init = function () {
  var self = this;
  self.db = new DB();
};

Engine.prototype.convertRawEvents = function (rawEvents) {
  var events = [];
  for (var i in rawEvents) {
    events.push(event.createEventFromData(rawEvents[i]));
  }
  return events;
};

Engine.prototype.add = function (rawEvents, callback) {
  var self = this,
    events = self.convertRawEvents(rawEvents);
  self.db.addEvents(events, callback);
};

module.exports.Engine = Engine;