#Phoenix [![Build Status](https://travis-ci.org/sdslabs/phoenix.svg?branch=master)](https://travis-ci.org/sdslabs/phoenix)

Redis based phantomjs queue

##Instructions

* Install `redis` (https://github.com/antirez/redis)
* Install npm modules(`$ npm install`)
* Run tests (`npm test`)

##Usage

By default it subscribes to a single channel specified in the config
Before you start using the application, assure that a redis server is running (`$ redis-server`).
Phoenix will refuse to start if redis is down

* Run app.js (`$ node app.js`)
* Publish a new message using `redis-cli` (`redis> PUBLISH imajs http://backdoor.sdslabs.co/`)

This trigger the node application to spawn a new `phantomjs` child process and opens the website.

You can see the `config.sample.yml` for a sample configuration. 
Note that some options are incompatible with each other, for eg
you can't send a request body in a GET request.

Do not edit default.yml unless you are working on phoenix itself.
