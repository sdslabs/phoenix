var request = require('../request');
var configParser = require('../config');
var assert = require('assert');
var config = configParser('test/fixtures/test_config.yml');
var url = require('url');

describe('Request', function(){

  it('should parse request config properly', function(){
    var settings = request(config.request);
    assert.equal(settings.header['DNT'], 1);
  });

  it('should parse auth headers properly', function(){
    var link = url.parse(request(config.request).url);
    assert.equal(link.auth, "username:password");

    delete config.request.auth.password;
    link = url.parse(request(config.request).url);
    assert.equal(link.auth, "username:");

    delete config.request.auth.username;
    link = url.parse(request(config.request).url);
    assert.equal(link.auth, null);

    config.request.auth.password = "password";
    link = url.parse(request(config.request).url);
    assert.equal(link.auth, ":password");
  });


  describe('should raise error for invalid bodies', function(){
    var req, fn;
    beforeEach(function(){
      req = configParser('test/fixtures/test_config.yml').request;
    });

    it('for GET + body', function(){
      fn = function(){
        req.body = "Hello";
      };
    });

    it('for HEAD + json', function(){
      fn = function(){
        req.method = 'head';
        req.json = {"phantom":"opera"};
      }
    });

    it('for OPTIONS + post', function(){
      fn = function(){
        req.method = 'OPTIONS';
        req.post = {"phantom":"opera"};
      }
    });

    afterEach(function(){
      assert.throws(function(){
        fn();
        request(req);
      }, /Invalid Request Body/);
    });
  });

  describe('should raise not error for valid bodies', function(){
    var req;
    beforeEach(function(){
      req = configParser('test/fixtures/test_config.yml').request;
    });

    it('for GET + no body', function(){
      req.method = 'GET';
    });

    it('for HEAD + no body', function(){
      req.method = 'head';
    });

    it('for POST + direct body', function(){
      req.method = 'POST';
      req.body = "Hello";
    });

    it('for PUT + json body', function(){
      req.method = 'PUT';
      req.json = {a:1};
    });

    it('for PATCH + post body', function(){
      req.method = 'PATCH';
      req.post = {a:1};
    });

    afterEach(function(){
      request(req);
    });
  });

  describe('should set correct Content-Type header for body requests', function(){
    var req, expectedContentType;
    beforeEach(function(){
      req = configParser('test/fixtures/test_config.yml').request;
    });

    it('for POST + body', function(){
      req.method = 'POST';
      req.body = "Hello";
      expectedContentType = undefined;
    });

    it('for PUT + json', function(){
      req.method = 'PUT';
      req.json = {a:1};
      expectedContentType = 'application/json';
    });

    it('for PATCH + post', function(){
      req.method = 'PATCH';
      req.post = {a:1};
      expectedContentType = 'application/x-www-form-urlencoded';
    });

    afterEach(function(){
      var settings = request(req);
      assert.equal(settings.header['Content-Type'], expectedContentType);
    });
  });
});
