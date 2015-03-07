var http = require('http');

var data1 = {
  interpretation: 'click',
  actor: 'user1',
  subjects: [{
    id: 'http://yahoo.com',
    interpretation: 'website',
    text: 'Yahoo!',
    manifestation: 'yahoo.com'
  }],
  timestamp: Date.now(),
  manifestation: 'clickFromWebsite',
  origin: 'http://yahoo.com',
  payload: []
};

var data2 = {
  interpretation: 'click',
  actor: 'user1',
  subjects: [{
    id: 'http://google.com',
    interpretation: 'website',
    text: 'Google Search',
    manifestation: 'google.com',
  }],
  timestamp: Date.now() + 86400000,
  manifestation: 'clickFromWebsite',
  origin: 'http://youtube.com',
  payload: []
};

var data3 = {
  interpretation: 'undo',
  actor: 'user1',
  subjects: [{
    id: 'http://yahoo.com',
    interpretation: 'website',
    text: 'Yahoo!',
    manifestation: 'yahoo.com'
  }],
  timestamp: Date.now(),
  manifestation: 'clickFromWebsite',
  origin: 'http://yahoo.com',
  payload: []
};

//The url we want is `www.nodejitsu.com:1337/`
var options = {
  host: 'localhost',
  path: '/insert_events',
  //since we are listening on a custom port, we need to specify it by hand
  port: '8000',
  //This is what changes the request to a POST request
  method: 'POST'
};


var options2 = {
  host: 'localhost',
  path: '/find_events',
  //since we are listening on a custom port, we need to specify it by hand
  port: '8000',
  //This is what changes the request to a POST request
  method: 'POST'
};


var printResponse = function (response, callback) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    var res = JSON.parse(str);
    console.log(res);
    console.log(res.length);
    setTimeout(callback, 3000);
  });
};

var req = http.request(options, function (response) {
  printResponse(response, function () {
    var req2 = http.request(options2, function (response) {
      printResponse(response, function () {});
    });
    var reqParams = {
      templates: [{
          interpretation: 'click',
          manifestation: 'clickFromWebsite'
        },
        {}],
      timerange: {
        from: 1425688965402
      },
      count: 200
    };
    req2.write(JSON.stringify(reqParams));
    req2.end();
  });
});
//This is the data we are posting, it needs to be a string or a buffer

var reqParams = {
  events: [data1, data2, data1, data3]
};
req.write(JSON.stringify(reqParams));
req.end();