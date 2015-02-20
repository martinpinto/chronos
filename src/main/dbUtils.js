/* exported getIndexForEvent, getFormattedEvents */
/*jshint unused: false */

var sugar = require('sugar'),
  acquire = require('acquire'),
  subject = acquire('subject'),
  event = acquire('event');


var getIndexForEvent = function (event) {
  var date = Date.create(event.timestamp),
    day = date.getUTCDate(),
    month = date.getUTCMonth() + 1,
    year = date.getFullYear();

  if (month < 10) {
    month = '0' + month;
  }
  return year + '_' + month + '_' + day;
};

var getFormattedEvents = function (events) {
  var bulkEvents = [];
  for (var i in events) {
    var event = events[i];
    bulkEvents.push({
      index: {
        _index: event.index,
        _type: event.type,
        _id: event.id
      }
    });
    bulkEvents.push(event);
  }
  return bulkEvents;
};

var getEventMapping = function () {
  var fieldMapping = {
    type: 'string',
    index: 'not_analyzed',
    fields: {
      analyzed: {
        type: 'string',
        index: 'analyzed'
      }
    }
  };

  var mapping = {
    id: fieldMapping
  };
  for (var f1 in event.requiredFields) {
    if (event.requiredFields[f1] === 'string') {
      mapping[f1] = fieldMapping;
    }
  }
  for (var f2 in event.optionalFields) {
    if (event.optionalFields[f2] === 'string') {
      mapping[f2] = fieldMapping;
    }
  }
  mapping.subjects = {
    type: 'nested',
    properties: getSubjectMapping()
  };

  return mapping;
};

var getSubjectMapping = function () {
  var fieldMapping = {
    type: 'string',
    index: 'not_analyzed',
    fields: {
      analyzed: {
        type: 'string',
        index: 'analyzed'
      }
    }
  };

  var mapping = {};
  for (var f1 in subject.requiredFields) {
    if (subject.requiredFields[f1] === 'string') {
      mapping[f1] = fieldMapping;
    }
  }
  for (var f2 in subject.optionalFields) {
    if (subject.optionalFields[f2] === 'string') {
      mapping[f2] = fieldMapping;
    }
  }
  return mapping;
};


module.exports.getIndexForEvent = getIndexForEvent;
module.exports.getFormattedEvents = getFormattedEvents;
module.exports.getEventMapping = getEventMapping;
module.exports.getSubjectMapping = getSubjectMapping;

console.log(getEventMapping())