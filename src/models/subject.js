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
  var event = new Subject();
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