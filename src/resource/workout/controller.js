'use strict';

var models = require('../../model');
var moment = require('moment');
moment().format();

module.exports = WorkoutController;

/*
 *
 */
function WorkoutController() {
  /*
   *
   */
  return{
    find: findWorkout,
    findAll: findWorkouts,
    create: createWorkout,
    update: updateWorkout,
    remove: removeWorkout,

    param: {
      workout_id: workoutIdParam
    }
  };

  /*
   *
   */
  function * findWorkout(/* next */) {
    var ctx = this;
    var workout = ctx.req.workout;

    ctx.assert((workout !== null && workout.is_deleted === false),
      404, 'Resource not found', {
        errors: [{
          resource: 'Workout',
          code: 'resource_not_found'
        }]
      });

    ctx.response.status = 200;
    ctx.response.body = workout.toJSON();
  }

  /*
   *
   */
  function * findWorkouts(/* next */) {
    var ctx = this;
    var options = {}
    var workouts;

    if (ctx.req.hasOwnProperty('sort')) {
      options.order = ctx.req.sort;
    }

    // Only display the current user's workouts.
    workouts = yield models.Workout
      .findAll({
        where: {
          is_deleted: false,
          user_id: ctx.req.user.id
        }
      }); 

    ctx.assert(workouts.length >= 1,
      404, 'Resource not found', {
        errors: [{
          resource: 'Workout',
          code: 'resource_not_found'
        }]
      });

    ctx.response.status = 200;
    ctx.response.body = {
      total_count: workouts.length,
      items: workouts.map(function jsonifyWorkouts(workout) {
        return workout.toJSON();
      })
    }
  }

  /*
   *
   */
  function * createWorkout(/* next */) {
    var ctx = this;
    var createdWorkout;

    ctx.assert((ctx.request.body !== null &&
              typeof ctx.request.body === 'object'),
      400, 'Body should be a JSON object');

    // User's id gets extracted from the request uri
    // and is assigned to the foreign key user_id.
    ctx.request.body.user_id = ctx.req.user.id;

    createdWorkout = yield models.Workout.create(ctx.request.body, {
      fields: [
        'id',
        'type',
        'user_id',
        'start_time',
        'end_time',
        'is_deleted'
      ]
    });

    ctx.response.status = 201;
    ctx.response.body = createdWorkout.toJSON();
  }


  function * updateWorkout(/* next */) {
    var ctx = this;
    var workout = ctx.req.workout;
    var updatedWorkout;

    ctx.assert((ctx.request.body !== null &&
              typeof ctx.request.body === 'object'),
      400, 'Body should be a JSON object');

    updatedWorkout = (yield workout.updateAttributes(ctx.request.body, {
        fields: [
          'id',
          'type',
          'start_time',
          'end_time',
          'is_deleted'
        ]
      })
    );

    ctx.response.status = 200;
    ctx.response.body = updatedWorkout.toJSON();
  }

  function * removeWorkout(/* next */) {
    var ctx = this;
    var workout = ctx.req.workout;
    var updatedWorkout;

    workout.is_deleted = true;

    updatedWorkout = (yield workout.updateAttributes(ctx.request.body, {
      fields: ['is_deleted']
    }));

    ctx.response.status = 200;
    ctx.response.body = workout.toJSON();
  }

  function * workoutIdParam(workout_id, next) {
    var ctx = this;
    var workout;

    if (workout_id === 'self') {
      workout = ctx.req.workout
    } else {
      workout = yield models.Workout
        .find({
          where: {
            id: workout_id
          }
        });
    }

    ctx.assert(workout !== null,
      404, 'Resource not found', {
        errors: [{
          resource: 'Workout',
          code: 'resource_not_found'
        }]
      });

    ctx.req.workout = workout;

    yield * next;
  }
}