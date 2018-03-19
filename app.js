var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var cookieSession = require('cookie-session');

var index = require('./routes/index');
var users = require('./routes/users');
var User = require('./models/User');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cookieSession({
  name: 'session',
  keys: ['m@ckl3mor3!sth#b0mb'],

  // Cookie Options
  // maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(function(user){
    done(null, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: '118322684414-ecjj1alfqvkj1knf16svb8mgbmdq23nj.apps.googleusercontent.com',
    clientSecret: 'ERjX7ARLGL8IzJ3hTZcquZc7',
    callbackURL: "http://nakumatt.herokuapp.com/auth/google/callback",
    passReqToCallback : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOne({ googleid: profile.id }, function (err, user) {
      if(!user){
        User.create({
          googleid: profile.id,
          names : profile.displayName,
          email: profile.email,
          username: profile.email,
          role: '0'
        },function(err, user){
          return done(err, user);
        })
      }else{        
        return done(null, user);
      }      
    }).catch(function(err){
      console.log(err);
    });
  }
));

app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg') || null;
  res.locals.error_msg = req.flash('error_msg') || null;
  res.locals.error = req.flash('error') || null;
  res.locals.user = req.user || null;
  if(req.user != null){
    next();
  }else{
     next();
  }
});

app.get('/auth/google', passport.authenticate('google', { scope: [
       'https://www.googleapis.com/auth/plus.login',
       'https://www.googleapis.com/auth/plus.profile.emails.read'] 
}));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get( '/auth/google/callback', 
      passport.authenticate( 'google', { 
        failureRedirect: '/login'
}),
function(req, res) {
	res.redirect('/');
});



app.use('/', index);
app.use('/users', users);

module.exports = app;
