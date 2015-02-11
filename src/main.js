var acquire = require('acquire'),
    Event = acquire('event');

var data = {
  type: 'click',
  actor: 'user1',
  subjects: [],
  timestamp: 1234567890,
  typeDomain: 'clickFromWebsite',
  orign: 'http://youtube.com',
  payload: []
};

var event = Event.createEventFromData(data);
console.log(event);