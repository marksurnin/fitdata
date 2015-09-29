'use strict';

var models = require('../../model');
var moment = require('moment');
moment().format();

module.exports = UserController;

/*
 *
 */
function UserController() {
  /*
   *
   */
  return{
    find: findUser,
    findAll: findUsers,
    create: createUser,
    update: updateUser,

    param: {
      user_id: userIdParam
    }
  };

  /*
   *
   */
  function * findUser(/* next */) { //?
    var ctx = this;
    var user = ctx.req.user;

    ctx.assert(user !== null,
      404, 'Resource not found', {
        errors: [{
          resource: 'User',
          code: 'resource_not_found'
        }]
      });

    ctx.response.status = 200;
    ctx.response.body = user.toJSON();
  }

  /*
   *
   */
  function * findUsers(/* next */) {
    var ctx = this;
    var options = {}
    var users;

    if (ctx.req.hasOwnProperty('sort')) {
      options.order = ctx.req.sort;
    }

    options.where = {is_deleted: false};

    users = yield models.User
      .findAll({
        where: {
          is_deleted: false
        }
      }); 

    ctx.assert(users.length >= 1,
      404, 'Resource not found', {
        errors: [{
          resource: 'User',
          code: 'resource_not_found'
        }]
      });

    ctx.response.status = 200;
    ctx.response.body = {
      total_count: users.length,
      items: users.map(function jsonifyUsers(user) {
        return user.toJSON();
      })
    }
  }

  /*
   *
   */
  function * createUser(/* next */) {
    var ctx = this;
    var createdUser;

    ctx.assert((ctx.request.body !== null &&
              typeof ctx.request.body === 'object'),
      400, 'Body should be a JSON object');

    createdUser = yield models.User.create(ctx.request.body, {
      fields: [
        'name',
        'id',
        'email',
        'is_coach',
        'is_deleted',
        'created_at',
        'updated_at'
      ]
    });

    ctx.response.status = 201;
    ctx.response.body = createdUser.toJSON();
  }


  function * updateUser(/* next */) {
    var ctx = this;
    var user = ctx.req.user;
    var updatedUser;

    ctx.assert((ctx.request.body !== null &&
              typeof ctx.request.body === 'object'),
      400, 'Body should be a JSON object');

    ctx.request.body.updated_at = moment();

    updatedUser = (yield user.updateAttributes(ctx.request.body, {
        fields: [
          'name',
          'id',
          'email',
          'is_coach',
          'is_deleted',
          'created_at',
          'updated_at'
        ]
      })
    );

    ctx.response.status = 200;
    ctx.response.body = updatedUser.toJSON();
  }


  function * userIdParam(user_id, next) {
    var ctx = this;
    var user;

    if (user_id === 'self') {
      user = ctx.req.user
    } else {
      user = yield models.User
        .find({
          where: {
            id: user_id
          }
        });
    }

    ctx.assert(user !== null,
      404, 'Resource not found', {
        errors: [{
          resource: 'User',
          code: 'resource_not_found'
        }]
      });

    ctx.req.user = user;

    yield * next;
  }
}