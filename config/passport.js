// config/passport.js

// load all the things we need
const LocalStrategy   = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin').Strategy;

const User = require('../app/models/user');
const configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err) {
                    return done(err, req.flash('signupMessage', 'Error on signin.'));
                }

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } 
                else {

                    // if there is no user with that email
                    // create the user
                    let newUser            = new User();

                    // set the user's local credentials
                    newUser.local.name = req.body.name;
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);

                    // save the user
                    newUser.save(function(err) {
                        if (err) 
                            throw err;
                        return done(null, newUser);
                    }); 
                }
            });    
        });
    }));

     // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        console.log('local login');
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err, req.flash('loginMessage', 'error on login'));

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));



    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        process.nextTick(function() {

            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    return done(null, user);
                } else {

                    let newUser          = new User();

                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    })); 

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : ['id', 'displayName', 'email', 'first_name']

    },

    function(token, refreshToken, profile, done) {

        process.nextTick(function() {

            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                if (err)
                    return done(err);

                if (user) {
                    console.log('user matched: ' + user);
                    console.log(profile);
                    return done(null, user); 
                } else {

                    let newUser            = new User();

                    newUser.facebook.id    = profile.id;                  
                    newUser.facebook.token = token;                     
                    newUser.facebook.name  = profile.displayName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; 
                    console.log('facebook profile retrieved');
                    console.log(profile);

                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    }); 
                };
            });
        });
    }));  

    // =========================================================================
    // LINKEDIN ================================================================
    // =========================================================================
    passport.use(new LinkedInStrategy({

        consumerKey     : configAuth.linkedinAuth.clientID,
        consumerSecret  : configAuth.linkedinAuth.clientSecret,
        callbackURL     : configAuth.linkedinAuth.callbackURL,
        profileFields   : ['id', 'first-name', 'last-name', 'email-address', 'headline']

    },

    function(token, refreshToken, profile, done) {

        process.nextTick(function() {

            User.findOne({ 'linkedin.id' : profile.id }, function(err, user) {

                if (err)
                    return done(err);

                if (user) {
                    console.log('user matched: ' + user);
                    console.log(profile);
                    return done(null, user); 
                } else {

                    let newUser            = new User();

                    newUser.linkedin.id    = profile.id;                  
                    newUser.linkedin.token = token;                     
                    newUser.linkedin.name  = profile.displayName; 
                    newUser.linkedin.email = profile.emails[0].value;  
                    console.log('linkedin profile retrieved');
                    console.log(profile);

                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    }); 
                };
            });
        });
    }));  

    // =========================================================================
    // GITHUB ================================================================
    // =========================================================================
    passport.use(new GitHubStrategy({

        clientID        : configAuth.githubAuth.clientID,
        clientSecret    : configAuth.githubAuth.clientSecret,
        callbackURL     : configAuth.githubAuth.callbackURL,
        userAgent      : 'CRM'

    },

    function(token, refreshToken, profile, done) {

        process.nextTick(function() {

            User.findOne({ 'github.id' : profile.id }, function(err, user) {

                if (err)
                    return done(err);

                if (user) {
                    console.log('user matched: ' + user);
                    console.log(profile);
                    return done(null, user); 
                } else {
                    console.log('github account retrieved');  
                    console.log(profile);

                    let newUser            = new User();

                    newUser.github.id    = profile.id;                  
                    newUser.github.token = token;                     
                    newUser.github.name  = profile.displayName;
                    newUser.github.email = profile.email ? profile.email : profile.username; 
         
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    }); 
                };
            });
        });
    }));  




};
