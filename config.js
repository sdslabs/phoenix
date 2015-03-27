var yaml = require('js-yaml');
var merge = require('merge');
var fs = require('fs');
var path = require('path');
var sh = require("shelljs");
var pathIsAbsolute = require('path-is-absolute');

var config = function(config_file) {
  var cwd = sh.pwd();
  if(typeof config_file === "undefined"){
    config_file = path.join(cwd, './config.yml');
  }
  else if(pathIsAbsolute(config_file)){
    config_file = config_file;
  }
  else{
    config_file = path.join(cwd, config_file);
  }
  try {
    var defPath = path.join(__dirname, './default.yml');
    var def = yaml.safeLoad(fs.readFileSync(defPath, 'utf8'));
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
