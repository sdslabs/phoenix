var url = require('url');
var merge = require('merge');
var qs = require('querystring');

var auth = function(request){
  var auth = "";
  if(request.auth.username)
    auth+=request.auth.username;
  auth+=":";
  if(request.auth.password)
    auth+=request.auth.password;
  if(auth!==":")
    return auth;
  else
    return null;
}

var validBody = function(request){
  var valid_body_methods = ['POST', 'PUT', 'PATCH'];
  var valid_no_body_methods = ['GET', 'TRACE', 'DELETE', 'HEAD', 'OPTIONS'];
  var method = request.method.toUpperCase();
  var isBodySet = request.body || request.json || request.post;
  var canSendBody = valid_body_methods.indexOf(method) >=0;
  var cantSendBody = valid_no_body_methods.indexOf(method)>=0;
  return (isBodySet && canSendBody) || (!isBodySet && cantSendBody);
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
      delete settings.header['Content-Type'];
    }
  }
  else{
    throw new Error("Invalid Request Body");
  }

  return settings;
}
