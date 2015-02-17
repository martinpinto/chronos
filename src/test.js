var acquire = require('acquire'),
    event = acquire('event');

var data = {
  type: 'click',
  actor: 'user1',
  subjects: [{
  	id: 'http://google.com',
	type: 'website',
	text: 'Google',
	domain: 'google.com'
  }],
  timestamp: 1234567890,
  typeDomain: 'clickFromWebsite',
  orign: 'http://youtube.com',
  payload: []
};
var e = event.createEventFromData(data);
console.log(e);