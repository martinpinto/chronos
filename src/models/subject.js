var sugar = require('sugar');

var requiredFields = {
  id: 'string',
  interpretation: 'string',
  text: 'string',
};

var optionalFields = {
  manifestation: 'string',
  origin: 'string',
  mimeType: 'string',
  storage: 'string',
  currentId: 'string'
};

var fields = Object.merge({}, requiredFields);
fields = Object.merge(fields, optionalFields);

function createSubjectFromData(data) {
  var subj = new Subject();

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
      subj[rkey] = data[rkey];
    }
  }
  for (var okey in optionalFields) {
    if (data[okey] && typeof data[okey] !== optionalFields[okey]) {
      throw Error('bad key');
    } else {
      subj[okey] = data[okey];
    }
  }
  return subj;
}

var Subject = function (data) {
  this.id = null; // string (not null)
  this.interpretation = null; // string (not null)
  this.text = null; // string (not null)
  this.domain = null; // string (not null)
  this.manifestation = null; // string (not null)
  this.origin = null; // string (not null)
  this.mimeType = null; // string (not null)
  this.storage = null; // string (not null)
  this.currentUri = null; // string (not null)
  this.init(data);
};

// class methods
Subject.prototype.init = function () {};

/**
Return True if this Subject matches *subject_template*. Empty
fields in the template are treated as wildcards.
Interpretations and manifestations are also matched if they are
children of the types specified in `subject_template`.
See also :meth:`Event.matches_template`
*/
Subject.prototype.matchesTemplate = function (subjectTemplate) {
  var self = this;
  for (var field in fields) {
    if (!subjectTemplate[field]) {
      continue;
    }
    if (field === 'storage') {
      throw Error('chronos does not support searching by "storage" field');
    } else {
      if (self[field] !== subjectTemplate[field]) {
        return false;
      }
    }
  }
  return true;
};

var validateTemplate = function (template) {
  for (var tfield in template) {
    if (!requiredFields[tfield] && !optionalFields[tfield]) {
      throw Error('found unsupported key: ' + field);
    }
  }
  for (var field in fields) {
    if (template[field] !== undefined &&
      template[field] !== null &&
      typeof template[field] !== fields[field]) {
      throw Error('bad key: ' + field + ' ' + typeof template[field]);
    }
  }
};

// export the class
module.exports.createSubjectFromData = createSubjectFromData;
module.exports.Subject = Subject;
module.exports.requiredFields = requiredFields;
module.exports.optionalFields = optionalFields;
module.exports.validateTemplate = validateTemplate;