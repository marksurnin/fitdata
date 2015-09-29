'use strict';

var _ = require('lodash');
var glob = require('glob');
var config = require('../../config');
var Sequelize = require('sequelize');

module.exports = (function Models() {
	var models = {};
	var options = config.get('db.options') || {};

	var sequelize = new Sequelize(config.get('db.database'), config.get('db.user'), config.get('db.pass'), options);

	glob.sync(__dirname + '/**/*.js') //?
		.forEach(function (file) {
			if (__filename === file) {
				return;
			}

			var model = sequelize['import'](file);
			models[model.name] = model;
		});

	_.forEach(_.keys(models), function (name) {
		if (_.has(models[name], 'associate')) {
			models[name].associate(models);
		}
	});

	return _.extend({
		Sequelize: Sequelize,
		sequelize: sequelize
	}, models);
})();