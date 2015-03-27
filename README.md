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

##Injection
By setting the `js` key in config.yml you can run code on the loaded web page before the page is
loaded itself.

##Logging
phoenix logs every phantomjs instance. For every instance that is created, a new temporary
directory is created in the logs directory. The config passed to phantomjs is stored in the `config.json`
file. The output from the phantomjs instance is stored in two files: `browser.log` and `page.log`.

`browser.log` is the higher level log file, which records events and errors made by the browser instance.
Such as Injection events and final status of the page load.

`page.log` holds the log from the page context. This includes any console.log statements made from the page
and any alert/confirm/prompt calls as well.

##Usage
Instead of cloning and running the entire repo for each project, you can use the npm package
(called `phantom-phoenix`), which has its own binary called `phoenix` which you can run.

To run `phoenix` in a directory, the following conditions must be true:

- a valid `config.yml` file must exist in the directory

After that you can push messages to the channel specified in the config, and phoenix will
start runners for each of your requests.
