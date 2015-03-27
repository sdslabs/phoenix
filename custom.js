var runInContext = function(){
  // This code will run in the page context
  // Before anything else is loaded
  navigator.platform = "phoenix";
}

exports.run = function(){
  return runInContext;
};
