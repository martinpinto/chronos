var preInsert = function (events) {
  for (var i in events) {
    if (events[i].interpretation === 'undo') {
      events[i] = null;
    }
  }
};

var postInsert = function (events) {
  console.log(events);
};

module.exports.preInsert = preInsert;
module.exports.postInsert = postInsert;