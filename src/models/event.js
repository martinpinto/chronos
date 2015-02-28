var acquire = require('acquire'),
  subject = acquire('subject'),
  md5 = require('MD5');

var requiredFields = {
  timestamp: 'number',
  interpretation: 'string',
  actor: 'string', //origin
  subjects: 'object',
};

var optionalFields = {
  manifestation: 'string', //trigger
  origin: 'string',
  payload: 'object'
};

function Event() {
  this.id = null; // string (not null)
  this.interpretation = null; // string (not null)
  this.manifestation = null; // string (not null)
  this.actor = null; // string (not null)
  this.origin = null; // string (not null)
  this.payload = null; // object (not null)
  this.subjects = []; // list (not null)
  this.timestamp = null; // int (not null)
  this.systemTimestamp = null; // int (not null)
  this.init();
}

// class methods
Event.prototype.init = function () {};

Event.prototype.match = function (event) {
  if (!event) {
    return true;
  }
  return true;
};

function createEventFromData(data) {
  var event = new Event(),
    createSubjects = function (subjects) {
      var newSubjects = [];
      for (var i in subjects) {
        var subjData = subjects[i];
        newSubjects.push(subject.createSubjectFromData(subjData));
      }
      return newSubjects;
    };

  event.systemTimestamp = Date.now();

  // Throw error if event has unsupported field
  for (var field in data) {
    if (!requiredFields[field] && !optionalFields[field]) {
      throw Error('found unsupported key: ' + field);
    }
  }

  // Make sure field values passed via data are all ov valid type
  for (var rkey in requiredFields) {
    if (typeof data[rkey] !== requiredFields[rkey]) {
      // TODO: Improve error message
      throw Error('bad key: ' + rkey + ' ' + typeof data[rkey]);
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

  if (event.timestamp > event.systemTimestamp) {
    throw Error('timestamp is future timestamp');
  }

  // generate the id at the end, since we are now using parameters
  // from the event to create the hash
  var idParamsStr = event.timestamp + event.interpretation + event.manifestation + event.actor;
  for (var i in event.subjects) {
    idParamsStr += event.subjects[i].id;
  }

  event.id = md5(idParamsStr);
  return event;
}

// export the class
module.exports.createEventFromData = createEventFromData;
module.exports.Event = Event;
module.exports.requiredFields = requiredFields;
module.exports.optionalFields = optionalFields;