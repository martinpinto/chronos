/* exported sugar */

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

var fields = Object.merge(Object.merge({}, requiredFields), optionalFields);

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

function validateTemplate(template) {
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
}

var Subject = function (data) {
  this.id = null; // string (not null)
  this.interpretation = null; // string (not null)
  this.text = null; // string (not null)
  this.interpretation = null; // string (not null)
  this.manifestation = null; // string (not null)
  this.origin = null; // string (not null)
  this.mimeType = null; // string (not null)
  this.storage = null; // string (not null)
  this.currentId = null; // string (not null)
  this.init(data);
};

// class methods
Subject.prototype.init = function () {};

// export the class
module.exports.createSubjectFromData = createSubjectFromData;
module.exports.Subject = Subject;
module.exports.requiredFields = requiredFields;
module.exports.optionalFields = optionalFields;
module.exports.validateTemplate = validateTemplate;
module.exports.fields = fields;