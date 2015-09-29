//add own Oauth

'use strict';

var koa = require('koa');
var json = require('koa-json');
var Router = require('koa-router');
var passport = require('koa-passport');
var bodyParser = require('koa-bodyparser');

var models = require('./model');
var config = require('../config');

var App = function App() {
  var app;
  var authRouter; // Public
  var resourceRouter; // Private

  if (!(this instanceof App)) {
     return new App();
  }

  app = koa();

  authRouter = new Router();
  resourceRouter = new Router();

  app.use(json());
  app.use(bodyParser());

  // Authentication
  require('./auth.js')(app, authRouter, passport);

  require('./resource')(app, resourceRouter);

  resourceRouter.prefix('/v1');

  app
  .use(resourceRouter.routes())
  .use(resourceRouter.allowedMethods());

  return app;
};

module.exports = App;