var uuid = require('node-uuid');

var requiredFields = {
  type: 'string',
  actor: 'string',
  subjects: 'object',
  timestamp: 'number'
    //systemTimestamp: 'number'
};

var optionalFields = {
  typeDomain: 'string',
  origin: 'string',
  payload: 'object'
};

function createEventFromData(data) {
  var event = new Event();
  event.id = uuid.v1();
  for (var rkey in requiredFields) {
    if (typeof data[rkey] !== requiredFields[rkey]) {
      // TODO: Improve error message
      throw Error('bad key');
    } else {
      event[rkey] = data[rkey];
    }
  }
  for (var okey in optionalFields) {
    if (data[okey] && typeof data[okey] !== optionalFields[okey]) {
      throw Error('bad key');
    } else {
      event[okey] = data[okey];
    }
  }
  return event;
}

function Event(data) {
  this.id = null; // string (not null)
  this.type = null; // string (not null)
  this.typeDomain = null; // string (not null)
  this.actor = null; // string (not null)
  this.origin = null; // string (not null)
  this.payload = null; // object (not null)
  this.subjects = []; // list (not null)
  this.timestamp = null; // int (not null)
  this.systemTimestamp = null; // int (not null)
  this.init(data);
}

// class methods
Event.prototype.init = function () {};

// export the class
module.exports = Event;