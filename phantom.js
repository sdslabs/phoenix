var page = require('webpage').create();
var system = require('system');
var fs = require('fs');
var args = system.args;
var timeout;

console.error = function (){
  require("system").stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
};

if(args.length < 2) {
  phantom.exit(1);
}

var configFile = args[1];
var settings = JSON.parse(fs.read(configFile));

console.log("URL:\t\t" + settings.url);

page.settings = settings.phantom;

if(args[2]){
  console.log("INJECT:\t\t"+args[2]);
  page.onInitialized = function (){
    var code = require(args[2]).run();
    page.evaluate(function (code) {
      console.error(code());
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

function exitNormal(){
  console.log("EXIT:\t\tNormal");
  phantom.exit(0);
}

// Lets quit by default in 0.5s
var timeout = setTimeout(exitNormal, 500);

// This method extends the timeout by 200ms
var c4timer = function(time){
  console.log("Extending timeout by " + time);
  if(timeout)
    clearTimeout(timeout);
  timeout = setTimeout(exitNormal, time);
}

page.onResourceRequested = function(requestData) {
  console.error("REQUEST:\t\t"+requestData.url);
  if(settings.url!==requestData.url)
    c4timer(1000);
};
page.onResourceTimeout = function(requestData) {
  console.error("TIMEOUT:\t\t"+requestData.url);
  if(settings.url!==requestData.url)
    c4timer(500);
};

page.onResourceError = function(resourceError) {
  console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
  console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
};

page.onResourceReceived = function(res) {
  console.error("RESPONSE:\t\t"+res.url);
  // This needs to be the last chunk
  if(settings.url!==res.url && res.stage === 'end')
    c4timer(1000);
};

page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }
    console.error(msgStack.join('\n'));
};

page.open(settings.url, settings, function (status){
  console.log("STATUS:\t\t"+status);
  // This is the hard kill switch
  // We force quit after 5 seconds
  setTimeout(function(){
    console.log("EXIT:\t\tForced");
    phantom.exit(0);
  }, 10000);
});
