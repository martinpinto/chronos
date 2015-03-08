/* exported sugar */
/*jshint -W106*/

var elasticsearch = require('elasticsearch'),
  acquire = require('acquire'),
  dbUtils = acquire('dbUtils'),
  sugar = require('sugar'),
  Seq = require('seq'),
  config = acquire('config'),
  event = acquire('event'),
  mappings = acquire('mappings');

function DB() {
  this.esClient = null;
  this.init();
}

// class methods
DB.prototype.init = function () {
  var self = this;
  self.esClient = new elasticsearch.Client({
    hosts: [
      {
        host: config.host,
        port: config.port,
    }]
  });
};

DB.prototype.createIndices = function (events, callback) {
  var self = this,
    indices = events.map(function (event) {
      return event.index;
    }).unique();

  try {
    new Seq(indices)
      .seqEach(function (index) {
        var that = this;
        self.esClient.indices.exists({
          index: index
        }, function (err, resp) {
          if (err) {
            throw err;
          }
          if (resp === true) {
            that();
          } else {
            self.esClient.indices.create({
              index: index,
              body: mappings
            }, function (err) {
              if (err) {
                throw err;
              }
              that();
            });
          }
        });
      })
      .seq(function () {
        callback();
      });
  } catch (ex) {
    callback(ex);
  }
};

DB.prototype.insertEvents = function (events, callback) {
  var self = this;

  // Assign proper indices toe the events
  events.map(function (event) {
    event.index = dbUtils.getIndexForEvent(event);
    return event;
  });

  self.createIndices(events, function (err) {
    if (err) {
      callback(err);
    }
    // Write to DB
    self.esClient.bulk({
      body: dbUtils.getFormattedEvents(events)
    }, function (err, resp) {
      var result = [];
      if (!err) {
        var items = resp.items;
        for (var i in items) {
          var item = {
            id: items[i].create._id,
            error: items[i].create.error ? items[i].create.error : null
          };
          result.push(item);
        }
      }
      callback(err, result);
    });
  });
};

DB.prototype.findEvents = function (eventTemplates,
  timerange,
  numEvents,
  callback) {
  var self = this;

  var termFilter = {
    or: eventTemplates.map(function (template) {
      var and = {
        and: []
      };
      if (Object.keys(template).length === 0) {
        and.and.push({
          match_all: {}
        });
        return and;
      }
      for (var field in template) {
        var term = {
          term: {}
        };
        term.term[field] = template[field];
        and.and.push(term);
      }
      return and;
    })
  };

  var timeFilter = {
    range: {
      timestamp: {
        gte: timerange.from,
        lt: timerange.to
      }
    }
  };

  var queryBody = {
    query: {
      filtered: {
        filter: {
          and: [termFilter, timeFilter]
        }
      }
    }
  };

  var esEvents = [];
  self.esClient.search({
    // Set to 30 seconds because we are calling right back
    scroll: '30s',
    size: 100,
    body: queryBody
  }, function getMoreUntilDone(error, response) {
    if (error) {
      return callback(error);
    }
    // collect the title from each response
    response.hits.hits.forEach(function (hit) {
      esEvents.push(hit);
    });

    if (numEvents > esEvents.length &&
      response.hits.total !== esEvents.length) {
      // now we can call scroll over and over
      self.esClient.scroll({
        scrollId: response._scroll_id,
        scroll: '30s'
      }, getMoreUntilDone);
    } else {
      var result = esEvents.slice(0, numEvents);
      var events = [];
      for (var i in result) {
        var rawEvent = result[i]._source;
        //var rawSubjects = result[i]._source.subjects;
        delete rawEvent.id;
        delete rawEvent.systemTimestamp;
        var e = event.createEventFromData(rawEvent);
        events.push(e);
      }
      callback(null, events);
    }
  });
};

// export the class
module.exports.DB = DB;