var acquire = require('acquire'),
    Server = acquire('server').Server;

var main = function(){
  var server = new Server();
  server.start();
};

if (require.main === module) {
    main();
}