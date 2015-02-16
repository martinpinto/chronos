var acquire = require('acquire'),
  uuid = require('node-uuid'),
  subject = acquire('subject');

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

function createEventFromData(data) {
  var event = new Event(),
    createSubjects = function (subjects) {
      for (var i in subjects) {
        var subjData = subjects[i];
        event.subjects.push(subject.createSubjectFromData(subjData));
      }
    };

  event.id = uuid.v1();
  for (var rkey in requiredFields) {
    if (typeof data[rkey] !== requiredFields[rkey]) {
      // TODO: Improve error message
      throw Error('bad key');
    } else {
      event[rkey] = data[rkey];
      if (rkey !== 'subjects') {
        event[rkey] = data[rkey];
      } else if (data.subjects.length === 0) {
        throw Error('at least one subject per event needed');
      } else {
        event.subjects = createSubjects(data.subjects);
      }
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
// export the class
module.exports.createEventFromData = createEventFromData;
module.exports.Event = Event;