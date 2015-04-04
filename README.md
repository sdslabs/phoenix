# Phoenix [![Build Status](https://travis-ci.org/sdslabs/phoenix.svg?branch=master)](https://travis-ci.org/sdslabs/phoenix)

Redis based phantomjs queue

## Instructions

* Install `redis` (https://github.com/antirez/redis)
* Install npm modules(`$ npm install`)
* Run tests (`npm test`)

## Usage

By default it subscribes to a single channel specified in the config
Before you start using the application, assure that a redis server is running (`$ redis-server`).
Phoenix will refuse to start if redis is down

* Run app.js (`$ node app.js`)

This trigger the node application to spawn a new `phantomjs` child process and opens the website.

You can see the `config.sample.yml` for a sample configuration. 
Note that some options are incompatible with each other, for eg
you can't send a request body in a GET request.

Do not edit default.yml unless you are working on phoenix itself.

## Injection
By setting the `js` key in config.yml you can run code on the loaded web page before the page is
loaded itself.

## Logging
phoenix logs every phantomjs instance. For every instance that is created, a new temporary
directory is created in the logs directory. The config passed to phantomjs is stored in the `config.json`
file. The output from the phantomjs instance is stored in two files: `browser.log` and `page.log`.

`browser.log` is the higher level log file, which records events and errors made by the browser instance.
Such as Injection events and final status of the page load.

`page.log` holds the log from the page context. This includes any console.log statements made from the page
and any alert/confirm/prompt calls as well.

## Usage
Instead of cloning and running the entire repo for each project, you can use the npm package
(called `phantom-phoenix`), which has its own binary called `phoenix` which you can run.

To run `phoenix` in a directory, the following conditions must be true:

- a valid `config.yml` file must exist in the directory

After that you can append messages to the list specified in the config, and phoenix will
start runners for each of your requests once you publish the id

You can append two things to the list:

- A complete valid http/https url. This replaces the url provided in the config
- A partial querystring (such as `a=1&b=2`). This overrides and merges with existing query params in the config

This way, you can send an `id=1` and phoenix will open the correct url.

## Redis

Instead of just using a redis pubsub, we use a hybrid pubsub+list model as queue to store logs. Instead
of directly publishing the request to the channel, you push it to a list, and then publish the index
of the just pushed item on the list. The list is maintained at `$channel:queue`, where $channel is the queue
name specified in the config.

For, eg if the channel name is the default (`phoenix`), you do the following:

- run `phoenix`
- `redis-cli`

```
RPUSH phoenix:queue "http://google.com"`
(integer) 8
PUBLISH phoenix 7
```

phoenix will pick this up and give something like following as output:

```
START: phoenix-11634lNeXLbHqhRM3
STOP : phoenix-11634lNeXLbHqhRM3
```
