'use strict';

var GoogleStrategy = require('passport-google-auth').Strategy;
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2('185442178785-std6c7jo7qinjdoq8agkqpa8h9t0jmo8.apps.googleusercontent.com', 'KxMTQ5GvSFIcNI9RxG6UJVEL', 'https://cc1e0737.ngrok.io/auth/google/callback');

var models = require('./model');
var config = require('../config');

var auth = function auth(app, authRouter, passport) {
  passport.serializeUser(function serializeUser(user, done) {
    done(null, user.id)
  });

  passport.deserializeUser(function deserializeUser(id, done) {
    done(null, {
      id: id
    });
  });

    // Oauth flow:
    // - Get token.
    // - Query google api with token for user profile
    // - Check local database for existing profile
    //   - If existing, attach token to profile
    //   - If not, create new user, attach token
    // - When a request comes in with a token, query local database

  passport.use(new GoogleStrategy(config.get('oauth.google'), function GoogleStrategy(accessToken, refreshToken, profile, done) {
    console.log(profile);
    this.body = profile;
    return done(null, profile);
    // oauth2Client.getToken(code, function(err, tokens) {
    //   //accessToken = this.access_token;
    //   if(!err) {
    //     console.log('pass');
    //     oauth.setCredentials(tokens);
    //   } else {
    //     console.log('error');
    //   }
    // });
  }));

  authRouter.get('/auth/google',
    passport.authenticate('google', { scope:['email', 'profile'],
      hostedDomain: 'nyu.edu', approvalPrompt: 'auto'}),
    function(req, res) {
      // This will never be called.
    });
  authRouter.get('/auth/google/callback/', passport.authenticate('google', { successRedirect: '/app', failureRedirect: '/' }));

  app.use(passport.initialize());
  app.use(authRouter.middleware());
};

module.exports = auth;


// var passport = require('koa-passport');

// var user = { id: 1, username: 'test'}; //?

// passport.serializeUser(function(user, done) {
// 	done(null, user);
// });

// var GoogleStrategy = require('passport-google-auth').Strategy;
// passport.use(new GoogleStrategy({
// 		clientId: '185442178785-std6c7jo7qinjdoq8agkqpa8h9t0jmo8.apps.googleusercontent.com',
// 		clientSecret: 'KxMTQ5GvSFIcNI9RxG6UJVEL',
// 		callbackURL: 'https://98b506b8.ngrok.io' + '/auth/google/callback'
// 	},
// 	function(token, tokenSecret, profile, done) {
// 		//retrieve user...
// 		done(null, user);
// 	}
// ));