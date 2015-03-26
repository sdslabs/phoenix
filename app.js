var redis = require('redis').createClient();
var path = require('path')
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var config = require('./config')();


redis.on('error', function(error) {
  // We die with redis
  console.log(error);
  process.exit(1);
})

redis.on('message', function(channel, message) {
  console.log('Message: ' + message + ' from channel ' + channel);

  var childArgs = [
    path.join(__dirname, 'phantom.js'),
    message
  ]

  console.log('Starting phantomjs');

  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    // done with the request
    console.log('Phantomjs Closed');
  })
})

// channel subscriptions
redis.subscribe(config.queue);
