var preInsert = function (events, callback) {
  for (var i in events) {
    if (events[i].interpretation === 'undo') {
      events[i].interpretation = 'test';
    }
  }
  callback();
};

var postInsert = function (events) {
  console.log(events);
};

module.exports.preInsert = preInsert;
module.exports.postInsert = postInsert;