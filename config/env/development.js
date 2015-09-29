'use strict';

module.exports = {
	port: 3000,

  db: {
    user: 'marks',
    pass: 'fitdata',
    database: 'postgres',
    options: {
      host: '127.0.0.1',
      port: 5432,
      dialect: 'postgres',
      logging: false
    }
  },

	oauth: {
		google: {
			clientId: '185442178785-std6c7jo7qinjdoq8agkqpa8h9t0jmo8.apps.googleusercontent.com',
			clientSecret: 'KxMTQ5GvSFIcNI9RxG6UJVEL',
			callbackURL: 'https://8a2e268d.ngrok.io/auth/google/callback',
      scope: ['email', 'profile'],
      hd: 'nyu.edu'
		}
	}
};