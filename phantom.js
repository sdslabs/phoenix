var page = require('webpage').create();
var system = require('system');
var fs = require('fs');
var args = system.args;

console.error = function (){
  require("system").stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
};

if(args.length < 2) {
  phantom.exit(1);
}

var configFile = args[1];
var settings = JSON.parse(fs.read(configFile));

console.log("URL:\t\t" + settings.url);

if(args[2]){
  console.log("INJECT:\t\t"+args[2]);
  page.onInitialized = function (){
    var code = require(args[2]).run();
    page.evaluate(function (code) {
      code();
    }, code);
  };
};

page.onConsoleMessage = function (msg){
  console.error(msg);
};

page.onAlert = function (msg){
  console.error("ALERT:\t\t"+msg)
}

page.onPrompt = function(msg, defaultVal) {
  console.error("PROMPT:\t\t"+msg);
  return defaultVal || null;
};

page.onConfirm = function(msg) {
  console.error("CONFIRM:\t\t"+msg);
  return false;//We always click the cancel button
};


page.open(settings.url, settings, function (status){
  console.log("STATUS:\t\t" + status);
  phantom.exit(0);
});
