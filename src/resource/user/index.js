'use strict';

module.exports = function UserResource(app, resourceRouter) {
	var userController = new require('./controller')();

	return resourceRouter
		// params
		.param('user_id', userController.param.user_id)
		// find all
		.get('/users/', userController.findAll)
		// create
		.post('/users', userController.create)
		// find
		.get('/users/:user_id', userController.find)
		// update
		.put('/users/:user_id', userController.update);
}