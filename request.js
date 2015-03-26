var url = require('url');
var merge = require('merge');
var qs = require('querystring');

var auth = function(request){
  return request.username+":"+request.password;
}

var validBody = function(request){
  var valid_body_methods = ['POST', 'PUT', 'PATCH'];
  var method = request.method.toUpperCase();
  var isBodySet = request.body || request.json || request.post;
  var canSendBody = valid_body_methods.indexOf(method) >=0;
  return (isBodySet && canSendBody) || (!isBodySet && !canSendBody);
}

// This parses the request object for phantom
module.exports = function(request){
  var settings = {};
  var link = url.parse(request.url, true);
  link.auth = auth(request);
  link.query = merge(link.query, request.query);
  settings.url = url.format(link);
  settings.header = request.headers;
  settings.operation = request.method;
  settings.encoding = request.encoding;
  // The priority order is BODY > JSON > POST
  if(validBody(request)){
    if(request.post){
      settings.body = qs.stringify(request.post);
      settings.header['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if(request.json){
      settings.body = JSON.stringify(request.json);
      settings.header['Content-Type'] = 'application/json';
    }
    if(request.body){
      settings.body = request.body;
    }
  }
  else{
    console.error("Invalid Request Body");
    process.exit(0);
  }

  return settings;
}
