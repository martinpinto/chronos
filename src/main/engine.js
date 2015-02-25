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
  var rejected = [];
  for (var i in rawEvents) {
    try {
      events.push(event.createEventFromData(rawEvents[i]));
    } catch (err) {
      rejected.push({
        event: rawEvents[i],
        error: err.message
      });
    }
  }
  return {
    events: events,
    rejected: rejected
  };
};

Engine.prototype.add = function (rawEvents, callback) {
  var self = this,
    events = self.convertRawEvents(rawEvents);

  self.db.addEvents(events.events, function (err, res) {
    res.rejected = events.rejected;
    callback(res);
  });
};

module.exports.Engine = Engine;