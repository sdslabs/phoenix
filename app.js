var listen = require('redis').createClient();
var redis  = require('redis').createClient();
var config = require('./config')();
var request = require('./request')
var settings = request(config.request);
var clone = require('clone');
var runner = require('./runner');

listen.on('error', function(error) {
  // We die with redis
  console.log(error);
  process.exit(1);
})

listen.on('message', function(channel, request_id) {

  redis.lrange(config.queue+':queue', request_id, request_id, function(err, message){
    var phantomConfig = clone(settings);
    phantomConfig.url = request.updateUrl(phantomConfig, message[0]);
    runner(config, phantomConfig);
  });

});

// channel subscriptions
listen.subscribe(config.queue);
