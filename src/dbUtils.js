var sugar = require('sugar');

var getIndexForEvent = module.exports = function (event) {
  var date = Date.create(event.timestamp),
    day = date.getUTCDate(),
    month = date.getUTCMonth() + 1,
    year = date.getFullYear();
  return year + '_' + month + '_' + day;
};

var getFormattedEvents = module.exports = function (events) {
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
    bulkEvents.push({
        title: 'foo'
    });
  }
  return bulkEvents;
};