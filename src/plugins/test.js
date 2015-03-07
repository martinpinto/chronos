var preInsert = function (events) {
  for (var i in events) {
    events[i] = null;
  }
};

var postInsert = function (events) {
  return events;
};

module.exports.preInsert = preInsert;
module.exports.postInsert = postInsert;