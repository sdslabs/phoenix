var redis = require('redis').createClient();
var path = require('path')
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var config = require('./config')();
var request = require('./request')
var settings = request(config.request);
var tmp = require('tmp');
var fs = require('fs');
var clone = require('clone');

redis.on('error', function(error) {
  // We die with redis
  console.log(error);
  process.exit(1);
})

redis.on('message', function(channel, message) {

  var phantomConfig = clone(settings);
  phantomConfig.url = request.updateUrl(phantomConfig, message);

  var cleanUp;

  tmp.dir({
    dir: path.join(__dirname, 'logs/'),
    prefix: 'phoenix-',
    postfix: '',
    keep: true
  },function (err, dir){
    if(err)
      return false;

    var configPath = path.join(dir, './config.json'),
      id = path.basename(dir);

    // Write the request config to the tmp file
    fs.writeFile(configPath, JSON.stringify(phantomConfig), {mode: 0600}, function (err){
      if(err){
        console.error("Couldn't write config");
        return;
      }

      console.log('START: ' + id);

      var childArgs = [
        path.join(__dirname, 'phantom.js'),
        configPath
      ];

      if(config.js){
        childArgs.push(path.join(__dirname, config.js));
      }

      childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        var logPath = path.join(dir, './browser.log'),
         errLogPath = path.join(dir, './page.log');
        // done with the request
        fs.writeFile(logPath, stdout);
        fs.writeFile(errLogPath, stderr);
        console.log('STOP : ' + id);
      });
    });
  });
});

// channel subscriptions
redis.subscribe(config.queue);
