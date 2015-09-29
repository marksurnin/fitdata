'use strict';

var config = require('convict')({
  env: {
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  }
});

config
  .load(require('./env/' + config.get('env') + '.js'))
  .validate();

module.exports = config;