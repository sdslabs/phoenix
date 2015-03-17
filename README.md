#Phoenix
Redis based phantomjs queue

##Instructions

* Install `$ redis` (https://github.com/antirez/redis)
* Install npm modules(`$ npm install`)

##Usage

By default it subscribes to a single channel `imajs` using redis.
Before you start using the application, assure that a redis server is running (`$ redis-server`).

* Run app.js (`$ node app.js`)
* Publish a new message using `redis-cli` (`redis> PUBLISH imajs http://backdoor.sdslabs.co/`)

This trigger the node application to spawn a new `phantomjs` child process and opens the website.
