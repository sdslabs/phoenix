var redis = require('redis').createClient();
var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path


client.on('error', function(error) {
  console.log(error)
})

client.on('message', function(channel, message) {
  console.log('Message: ' + message + ' from channel ' + channel)

  var childArgs = [
    path.join(__dirname, 'phantomjs-script.js'),
    message
  ]

  console.log('Starting phantomjs')

  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    // done with the request
    console.log('Phantomjs Closed')
  })
})

// channel subscriptions
client.subscribe('imajs')
