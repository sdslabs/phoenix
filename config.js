var yaml = require('js-yaml');
var merge = require('merge');
var fs = require('fs');

var config = (function(config_file) {
  if(typeof config_file === "undefined"){
    config_file = './config.yml';
  }
  try {
    var def = yaml.safeLoad(fs.readFileSync('./default.yml', 'utf8'));
    var patch   = yaml.safeLoad(fs.readFileSync(config_file, 'utf8'));
    var config = merge(def, patch);
    return config;
    console.log(doc);
  } catch (e) {
    console.log(e);
    console.log("YAML parser error");
    process.exit(1);
  }
})();

module.exports = config;