var acquire = require('acquire'),
  DB = acquire('db').DB,
  event = acquire('event'),
  eventManager = acquire('eventManager');

var Engine = function () {
  this.db = null;
  this.eventManager = null;
  this.init();
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
  var self = this,
    events = self.convertRawEvents(rawEvents);

  for (var i in self.eventManager.plugins) {
    self.eventManager.plugins[i].preInsert(events.events);
  }

  var nullEvents = [];
  var tempEvents = [];
  for (var j in events.events) {
    if (events.events[j]) {
      tempEvents.push(events.events[j]);
      nullEvents.push(null);
    } else {
      nullEvents.push({
        index: null,
        type: null,
        id: null,
        error: 'event nullified'
      });
    }
  }

  var createResults = function (res) {
    var eventPos = 0,
      result = [];

    for (var i in nullEvents) {
      if (!nullEvents[i]) {
        nullEvents[i] = res[eventPos];
        eventPos++;
      }
    }

    eventPos = 0;
    for (var j in events.rejected) {
      if (events.rejected[j]) {
        result.push({
          index: null,
          type: null,
          id: null,
          error: events.rejected[j]
        });
      } else {
        result.push(nullEvents[eventPos]);
        eventPos++;
      }
    }
    callback(null, result);
  };

  if (tempEvents.length == 0) {
    createResults(events.events);
  } else {
    self.db.insertEvents(tempEvents, function (err, res) {
      if (err) {
        return callback(err, null);
      } else {
        createResults(res);
        // Post Insert
        var events = [];
        for (var i in res) {
          if (!res[i].error) {
            events.push(tempEvents[i])
          }
        }

        for (var i in self.eventManager.plugins) {
          self.eventManager.plugins[i].postInsert(Object.clone(events));
        }
      }
    });
  }
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