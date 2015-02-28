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
      rejected.push(null);
    } catch (err) {
      rejected.push(err.message);
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
    var eventPos = 0,
      result = [];

    if (err) {
      return callback(err, null);
    }

    for (var i in events.rejected) {
      if (events.rejected[i]) {
        result.push({
          index: null,
          type: null,
          id: null,
          error: events.rejected[i]
        });
      } else {
        result.push(res[eventPos]);
        eventPos++;
      }
    }

    callback(null, result);
  });
};

module.exports.Engine = Engine;