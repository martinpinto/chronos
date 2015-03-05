/*exported getIndexForEvent, getFormattedEvents*/
/*jshint unused: false */

var sugar = require('sugar'),
  acquire = require('acquire'),
  subject = acquire('subject'),
  event = acquire('event'),
  config = require('config');

var getIndexForEvent = function (event) {
  var date = Date.create(event.timestamp),
    day = date.getUTCDate(),
    month = date.getUTCMonth() + 1,
    year = date.getFullYear();

  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  return 'cg_' + year + '_' + month + '_' + day;
};

var getFormattedEvents = function (events) {
  var bulkEvents = [];
  for (var i in events) {
    bulkEvents.push({
      create: {
        _index: events[i].index,
        _type: events[i][config.get('engine.dbConfig.typeField')],
        _id: events[i].id
      }
    });
    delete events[i].index;
    bulkEvents.push(events[i]);
  }
  return bulkEvents;
};

module.exports.getIndexForEvent = getIndexForEvent;
module.exports.getFormattedEvents = getFormattedEvents;