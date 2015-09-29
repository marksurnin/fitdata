'use strict';

var glob = require('glob');

module.exports = function ResourceLoader(app, resourceRouter) {
  glob(__dirname + '/**/index.js', function (err, files) {
    files.forEach(function (file) {

      if (file === __filename) {
        return;
      }

      require(file)(app, resourceRouter);
    });
  });
};