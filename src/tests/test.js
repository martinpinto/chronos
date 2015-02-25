var http = require('http');

var data1 = {
  type: 'click',
  actor: 'user1',
  subjects: [{
    id: 'http://yahoo.com',
    type: 'website',
    text: 'Yahoo!',
    domain: 'yahoo.com'
  }],
  timestamp: Date.now(),
  typeDomain: 'clickFromWebsite',
  origin: 'http://yahoo.com',
  payload: []
};

var data2 = {
  type: 'click',
  actor: 'user1',
  subjects: [{
    id: 'http://google.com',
    type: 'website',
    text: 'Google Search',
    domain: 'google.com',
  }],
  timestamp: Date.now() + 86400000,
  typeDomain: 'clickFromWebsite',
  origin: 'http://youtube.com',
  payload: []
};

//The url we want is `www.nodejitsu.com:1337/`
var options = {
  host: 'localhost',
  path: '/add',
  //since we are listening on a custom port, we need to specify it by hand
  port: '8000',
  //This is what changes the request to a POST request
  method: 'POST'
};

var callback = function (response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
  });
};

var req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
req.write(JSON.stringify([data1, data2, data1]));
req.end();