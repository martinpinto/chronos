/* exported sugar */

var acquire = require('acquire'),
  subject = acquire('subject'),
  md5 = require('MD5'),
  sugar = require('sugar');

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

var fields = Object.merge(Object.merge({}, requiredFields), optionalFields);

function createEventFromData(data) {
  if (data == null) {
    throw Error('event is null');
  }
  var event = new Event(),
    createSubjects = function (subjects) {
      if (subjects instanceof Array === false) {
        throw Error('subjects should be a list');
      }
      if (subjects.length === 0) {
        throw Error('at least one subject is required');
      }
      var newSubjects = [];
      for (var i in subjects) {
        var subjData = subjects[i];
        newSubjects.push(subject.createSubjectFromData(subjData));
      }
      return newSubjects;
    };

  event.systemTimestamp = Date.now();

  // Make sure field values passed via data are all of valid type
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
    throw Error('future timestamp');
  }

  // generate the id at the end, since we are now using parameters
  // from the event to create the hash
  var idParamsStr = event.timestamp + event.interpretation +
    event.manifestation + event.actor;
  for (var i in event.subjects) {
    idParamsStr += event.subjects[i].id;
  }

  event.id = md5(idParamsStr);
  return event;
}

function validateTemplate(template) {
  // Throw error if event has unsupported field
  for (var tfield in template) {
    if (!requiredFields[tfield] && !optionalFields[tfield]) {
      throw Error('found unsupported key: ' + tfield);
    }
    if (tfield === 'timestamp' || tfield === 'id') {
      throw Error('event templates do not support field: ' + tfield);
    }
  }
  for (var field in fields) {
    if (field === 'subjects') {
      continue;
    }
    if (template[field] !== undefined &&
      template[field] !== null &&
      typeof template[field] !== fields[field]) {
      throw Error('bad key: ' + field + ' ' + typeof template[field]);
    }
  }

  // We have no subjects so template is valid
  if (!template.subjects || template.subjects.length === 0) {
    return;
  }

  for (var i in template.subjects) {
    subject.validateTemplate(template.subjects[i]);
  }
}

var Event = function () {
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
};

// class methods
Event.prototype.init = function () {};


// export the class
module.exports.createEventFromData = createEventFromData;
module.exports.Event = Event;
module.exports.requiredFields = requiredFields;
module.exports.optionalFields = optionalFields;
module.exports.validateTemplate = validateTemplate;
module.exports.fields = fields;