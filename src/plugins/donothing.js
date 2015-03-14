var preInsert = function (events, callback) {
  callback();
};

var postInsert = function (events) {
  console.log(events);
};

module.exports.preInsert = preInsert;
module.exports.postInsert = postInsert;