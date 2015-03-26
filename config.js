var yaml = require('js-yaml');
var merge = require('merge');
var fs = require('fs');
var path = require('path');

var config = function(config_file) {
  if(typeof config_file === "undefined"){
    config_file = path.join(__dirname, 'config.yml');
  }
  else{
    config_file = path.join(__dirname, config_file);
  }
  try {
    var def = yaml.safeLoad(fs.readFileSync('./default.yml', 'utf8'));
    var patch   = yaml.safeLoad(fs.readFileSync(config_file, 'utf8'));
    var conf = merge.recursive(def, patch);
    return conf;
  } catch (e) {
    console.log(e);
    console.log("YAML parser error");
    process.exit(1);
  }
};

module.exports = config;
