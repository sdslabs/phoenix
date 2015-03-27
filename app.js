var redis = require('redis').createClient();
var path = require('path')
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var config = require('./config')();
var settings = require('./request')(config.request);
var tmp = require('tmp');
var fs = require('fs');

redis.on('error', function(error) {
  // We die with redis
  console.log(error);
  process.exit(1);
})

redis.on('message', function(channel, message) {

  var cleanUp;

  tmp.dir({
    dir: path.join(__dirname, 'logs/'),
    prefix: 'phoenix-',
    postfix: '',
    keep: true
  },function (err, dir){
    if(err)
      return false;

    var configPath = path.join(dir, './config.json');

    // Write the request config to the tmp file
    fs.writeFile(configPath, JSON.stringify(settings), {mode: 0600}, function (err){
      if(err){
        console.error("Couldn't write config");
        return;
      }

      console.log('Starting phantomjs');

      var childArgs = [
        path.join(__dirname, 'phantom.js'),
        configPath
      ];

      if(config.js){
        childArgs.push(path.join(__dirname, config.js));
      }

      console.log(childArgs);

      childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        var logPath = path.join(dir, './browser.log'),
         errLogPath = path.join(dir, './page.log');
        // done with the request
        fs.writeFile(logPath, stdout);
        fs.writeFile(errLogPath, stderr);
        console.log('Phantomjs Closed');
      });
    });
  });
});

// channel subscriptions
redis.subscribe(config.queue);
