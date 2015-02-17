var elasticsearch = require('elasticsearch'),
  acquire = require('acquire'),
  dbUtils = acquire('dbUtils');

function DB() {
  this.esClient = null;
  this.init();
}

// class methods
DB.prototype.init = function () {
  var self = this;
  self.esClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
  });
};

DB.prototype.addEvents = function (events, callback) {
  var self = this;

  // TODO: check if each event is valid
  for (var i in events) {
    var event = events[i];
    event.index = dbUtils.getIndexForTimestamp(event.timestamp);
  }
  
  // Write to DB
  var formattedEvents = dbUtils.getFormattedEvents(events);
  self.esClient.bulk({
    body: formattedEvents
  }, function (err, resp) {
    callback(err, resp);
  });

};

// export the class
module.exports.DB = DB;