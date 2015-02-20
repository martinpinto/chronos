var requiredFields = {
  id: 'string',
  type: 'string',
  text: 'string',
  domain: 'string'
};

var optionalFields = {
  typeDomain: 'string',
  origin: 'string',
  mimeType: 'string'
};

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

function Subject(data) {
  this.id = null; // string (not null)
  this.type = null; // string (not null)
  this.text = null; // string (not null)
  this.domain = null; // string (not null)
  this.typeDomain = null; // string (not null)
  this.origin = null; // string (not null)
  this.mimeType = null; // string (not null)
  this.init(data);
}

// class methods
Subject.prototype.init = function () {};

// export the class
module.exports.createSubjectFromData = createSubjectFromData;
module.exports.Subject = Subject;
module.exports.requiredFields = requiredFields;
module.exports.optionalFields = optionalFields;