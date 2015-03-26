var request = require('../request');
var configParser = require('../config');

var config = configParser('test/fixtures/test_config.yml');

describe('Request', function(){
  it('should parse request config properly', function(){
    //console.log(config.request);
    var settings = request(config.request);
  });
});
