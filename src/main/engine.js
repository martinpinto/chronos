var acquire = require('acquire'),
  DB = acquire('db').DB,
  event = acquire('event'),
  eventManager = acquire('eventManager'),
  winston = require('winston');

var Engine = function () {
  this.db = null;
  this.eventManager = null;
  this.init();
  winston.log('info', 'HTTP server started.');
};

Engine.prototype.init = function () {
  var self = this;
  self.eventManager = new eventManager.EventManager();
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

Engine.prototype.insertEvents = function (rawEvents, callback) {
  var self = this;

  // Pre Insert
  self.eventManager.preInsert(rawEvents, function () {
    var events = self.convertRawEvents(rawEvents);

    if (events.events.length === 0) {
      return callback(null, events.rejected.map(function (event) {
        return {
          id: null,
          error: event
        };
      }));
    }

    self.db.insertEvents(events.events, function (err, res) {
      var eventPos = 0,
        result = [],
        postEvents = [];

      if (err) {
        return callback(err, null);
      }

      for (var i in events.rejected) {
        if (events.rejected[i]) {
          result.push({
            id: null,
            error: events.rejected[i]
          });
        } else {
          result.push(res[eventPos]);
          if (res[eventPos].error) {
            postEvents.push(events.events[eventPos]);
          }
          eventPos++;
        }
      }
      callback(null, result);

      self.eventManager.postInsert(postEvents);
    });
  });
};

Engine.prototype.findEvents = function (eventTemplates,
  timerange,
  numEvents,
  callback) {
  var self = this;
  try {
    for (var i in eventTemplates) {
      event.validateTemplate(eventTemplates[i]);
    }
    if (timerange.from > timerange.to) {
      throw new Error('invalid timerange');
    }
    if (!timerange.from) {
      timerange.from = 0;
    }
    if (!timerange.to) {
      timerange.to = Date.now();
    }
  } catch (ex) {
    return callback(ex);
  }
  self.db.findEvents(eventTemplates,
    timerange,
    numEvents,
    callback);
};

module.exports.Engine = Engine;