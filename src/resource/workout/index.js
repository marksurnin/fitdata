'use strict';

module.exports = function WorkoutResource(app, resourceRouter) {
	var workoutController = new require('./controller')();

	return resourceRouter
		// params
		.param('workout_id', workoutController.param.workout_id)
		// find all
		.get('/users/:user_id/workouts/', workoutController.findAll)
		// create
		.post('/users/:user_id/workouts/', workoutController.create)
		// find
		.get('/users/:user_id/workouts/:workout_id', workoutController.find)
		// update
		.put('/users/:user_id/workouts/:workout_id', workoutController.update)
		// remove
		.delete('/users/:user_id/workouts/:workout_id', workoutController.remove);
}