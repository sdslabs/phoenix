var redis = require('redis');
var client = redis.createClient();

client.on('error', function(error) {
  console.log(error);
});

client.on('message', function(channel, message) {
  console.log('Message: ' + message + ' from channel ' + channel);
});

// channel subscriptions
client.subscribe('imajs');
