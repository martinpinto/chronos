/* exported getIndexForEvent, getFormattedEvents */
/*jshint unused: false */

var sugar = require('sugar'),
  acquire = require('acquire'),
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


function getEventMapping() {
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

  var mapping = {id: fieldMapping}
  for (var field in event.requiredFields) {
    if (event.requiredFields[field] == 'string')
      mapping[field] = fieldMapping;
  }
  for (var field in event.optionalFields) {
    if (event.optionalFields[field] == 'string')
      mapping[field] = fieldMapping;
  }
  return mapping;
}


module.exports.getIndexForEvent = getIndexForEvent;
module.exports.getFormattedEvents = getFormattedEvents;
module.exports.getEventMapping = getEventMapping;