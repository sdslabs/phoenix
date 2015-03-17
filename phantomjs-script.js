var page = require('webpage').create()
var system = require('system')
var args = system.args

if(args.length !== 2) {
  phantom.exit(1)
}

var url = args[1]

console.log('URL: ' + url)

page.open(url, function(status) {
  console.log("Status: " + status)
  phantom.exit(0)
});
