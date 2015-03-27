var url = require('url');
var merge = require('merge');
var qs = require('querystring');
var validUrl = require('valid-url');

var auth = function(request){
  if(!request.auth)
    return null;
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
  var isBodySet = request.body || request.json || request.data;
  var canSendBody = valid_body_methods.indexOf(method) >=0;
  var cantSendBody = valid_no_body_methods.indexOf(method)>=0;
  return (isBodySet && canSendBody) || (!isBodySet && cantSendBody);
}

// This parses the request object for phantom
var req = function(request){
  var settings = {};
  var link = url.parse(request.url, true);
  delete link.search;
  link.auth = auth(request);
  link.query = merge(link.query, request.query);
  settings.url = url.format(link);
  settings.header = request.headers;
  settings.operation = request.method;
  settings.encoding = request.encoding;
  // The priority order is BODY > JSON > POST
  if(validBody(request)){
    if(request.data){
      settings.body = qs.stringify(request.data);
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

req.updateUrl = function(settings, partial){
  if(validUrl.isWebUri(partial)){
    settings.url = partial;
  }
  else if(partial.length > 0){
    var query = qs.parse(partial);
    var link = url.parse(settings.url, true);
    delete link.search;
    link.query = merge.recursive(link.query, query);
    settings.url = url.format(link);
  }
  return settings.url;
}

module.exports = req;
