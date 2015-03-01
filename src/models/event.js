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

var fields = Object.merge({}, requiredFields);
fields = Object.merge(fields, optionalFields);

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


/**
Return True if this event matches *event_template*. The
matching is done where unset fields in the template is
interpreted as wild cards. Interpretations and manifestations
are also matched if they are children of the types specified
in `event_template`. If the template has more than one
subject, this event matches if at least one of the subjects
on this event matches any single one of the subjects on the
template.

Basically this method mimics the matching behaviour
found in the :meth:`FindEventIds` method on the Zeitgeist engine.
*/
Event.prototype.matchesTemplate = function (eventTemplate) {
  var self = this;
  if (!eventTemplate) {
    return false;
  }

  // We use direct member access to speed things up a bit
  // First match the raw event data
  for (var field in fields) {
    // We don't match timestamps and subject will be treated seperatly
    if (field === 'id' || field === 'timestamp' || field === 'subjects') {
      continue;
    }
    if (eventTemplate[field] && eventTemplate[field] !== self[field]) {
      return false;
    }
  }

  // If eventTemplate has no subjects we have a match
  if (!eventTemplate.subjects || eventTemplate.subjects.length === 0) {
    return true;
  }

  // Now we check the subjects
  for (var i in eventTemplate.subjects) {
    var tsubj = eventTemplate.subjects[i];
    for (var j in self.subjects) {
      var subj = self.subjects[j];
      if (!subj.matchesTemplate(tsubj)) {
        continue;
      }
      // We have a matching subject, all good!
      return true;
    }
  }

  // Template has subjects, but we never found a match
  return false;
};


function createEventFromData(data) {
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
  var idParamsStr = event.timestamp + event.interpretation +
    event.manifestation + event.actor;
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