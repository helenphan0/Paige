require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {const express = __webpack_require__(2);
	const session = __webpack_require__(3);
	const app = express();
	const mongoose = __webpack_require__(4);
	const passport = __webpack_require__(5);
	const bcrypt = __webpack_require__(6);
	const flash = __webpack_require__(7);
	
	const bodyParser = __webpack_require__(8);
	const cookieParser = __webpack_require__(9);
	
	const configDB = __webpack_require__(10);
	
	mongoose.Promise = global.Promise;
	mongoose.connect(configDB.url);
	
	__webpack_require__(11)(passport);
	
	app.use(express.static('app'));   
	
	app.use(cookieParser());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
	    extended: true
	}));
	app.set('view engine', 'pug'); 
	app.use(session({ 
		secret: 'ceiling cat',
		resave: true,
	    saveUninitialized: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	
	__webpack_require__(19)(app, passport);
	
	app.listen(process.env.PORT || 8080, function() {
	    console.log('Server started at http://localhost:8080');
	});
	
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("express-session");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("passport");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("bcryptjs");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("connect-flash");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("cookie-parser");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = {
		// looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
	    'url' : 'mongodb://tester:1234@ds021166.mlab.com:21166/crm' 
	
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// config/passport.js
	
	// load all the things we need
	const LocalStrategy   = __webpack_require__(12).Strategy;
	const FacebookStrategy = __webpack_require__(13).Strategy;
	const GoogleStrategy = __webpack_require__(14).OAuth2Strategy;
	const GitHubStrategy = __webpack_require__(15).Strategy;
	const LinkedInStrategy = __webpack_require__(16).Strategy;
	
	const User = __webpack_require__(17);
	const configAuth = __webpack_require__(18);
	
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("passport-local");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("passport-facebook");

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("passport-google-oauth");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("passport-github2");

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("passport-linkedin");

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	const mongoose = __webpack_require__(4);
	const bcrypt = __webpack_require__(6);
	
	// define the schema for our user model
	const userSchema = new mongoose.Schema({
	
	    local            : {
	        email        : String,
	        password     : String,
	        name         : String
	    },
	    facebook         : {
	        id           : String,
	        token        : String,
	        email        : String,
	        name         : String
	    },
	    google           : {
	        id           : String,
	        token        : String,
	        email        : String,
	        name         : String
	    },
	    github           : {
	        id           : String,
	        token        : String,
	        email        : String,
	        name         : String
	    },
	    linkedin           : {
	        id           : String,
	        token        : String,
	        email        : String,
	        name         : String
	    }
	
	});
	
	// methods ======================
	// generating a hash
	userSchema.methods.generateHash = function(password) {
	    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};
	
	// checking if password is valid
	userSchema.methods.validPassword = function(password) {
	    return bcrypt.compareSync(password, this.local.password);
	};
	
	// create the model for users and expose it to our app
	module.exports = mongoose.model('User', userSchema);

/***/ },
/* 18 */
/***/ function(module, exports) {

	// config/auth.js
	
	// expose our config directly to our application using module.exports
	module.exports = {
	
	    'facebookAuth' : {
	        'clientID'      : '1112500148831397', 
	        'clientSecret'  : '74d6fdaa284dbd772a830c33d01c547b', 
	        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
	        'profileFields' :  ["emails", "displayName", "name", "email", "hometown", "location"]
	    },
	
	    'googleAuth' : {
	        'clientID'      : '792416882677-megla5jquv3no6oricto4gaca02pq9oq.apps.googleusercontent.com',
	        'clientSecret'  : 'cn2484z3pqJ4hNpRHdg0LHNg',
	        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
	    },
	
	    'githubAuth' : {
	        'clientID'      : 'b5991bbd2f36322c7ee9',
	        'clientSecret'  : '890327b582412b907b4a74d18e5ce7a4a80946dd',
	        'callbackURL'   : 'http://localhost:8080/auth/github/callback'
	    },
	
	    'linkedinAuth' : {
	        'clientID'      : '78h7rxui49b4l4',
	        'clientSecret'  : '7zCIEfR5uJ7lKUF2',
	        'callbackURL'   : "http://localhost:8080/auth/linkedin/callback"
	  }
	
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	const User = __webpack_require__(17);
	const Page = __webpack_require__(20);
	const Project = __webpack_require__(21);
	const Skill = __webpack_require__(22);
	// const Site = require('../app/models/site');
	
	module.exports = function(app, passport) { 
	    
	    // =====================================
	    // HOME PAGE (with login links) ========
	    // =====================================
	    app.get('/', function(req, res) {
	
	       res.render('index.pug', { message: req.flash('signupMessage') } ); 
	    });
	
	    // =====================================
	    // LOGIN ===============================
	    // =====================================
	    app.get('/login', function(req, res) {
	
	        res.render('login.pug', { message: req.flash('loginMessage') }); 
	    });
	
	    app.post('/login', passport.authenticate('local-login', {
	        successRedirect : '/cms', // redirect to the secure profile section
	        failureRedirect : '/login', // redirect back to the signup page if there is an error
	        failureFlash : true // allow flash messages
	    }));
	
	    // =====================================
	    // SIGNUP ==============================
	    // =====================================
	    app.get('/signup', function(req, res) {
	
	        res.render('signup.pug', { message: req.flash('signupMessage') });
	    });
	
	    app.post('/signup', passport.authenticate('local-signup', {
	        successRedirect : '/cms', 
	        failureRedirect : '/signup', 
	        failureFlash : true 
	    }));
	
	    // =============
	    // DEFAULT THEME 
	    // =============
	
	    app.get('/default/home/:friendlyUrl', function(req, res) {
	
	        Page.findOne({ friendlyUrl: req.params.friendlyUrl}, function(err, page) {
	
	            if (err) {
	                return res.status(500);
	            }
	
	            if (!page) {
	                console.log('page not found from parameter: ' + req.params.friendlyUrl);
	                return res.status(404).json(null);
	            }
	
	            if (page) {
	                    
	                res.render('../themes/default/home.pug', {
	                    title : page.title,
	                    friendlyUrl : page.friendlyUrl,
	                    content: page.content
	                }); 
	            }
	        })  
	    
	    // =====
	    // =====
	        app.get('/default/about/:friendlyUrl', function(req, res) {
	
	            Page.findOne( {friendlyUrl: req.params.friendlyUrl}, function(err, page) {
	
	                if (err) {
	                    return res.status(500);
	                }
	
	                if (!page) {
	                    console.log('page not found from parameter: ' + req.params.friendlyUrl);
	                    return res.status(404).json(null);
	                }
	
	                res.render('../themes/default/about.pug', {
	                    aboutTitle: page.title,
	                    aboutUrl: page.friendlyUrl,
	                    aboutContent: page.content
	                });
	            });
	        })
	
	    // =====
	    // =====
	        app.get('/default/portfolio/:friendlyUrl', function(req, res) {
	
	            Page.findOne( {friendlyUrl: req.params.friendlyUrl}, function(err, page) {
	
	                if (err) {
	                    return res.status(500);
	                }
	
	                if (!page) {
	                    console.log('page not found from parameter: ' + req.params.friendlyUrl);
	                    return res.status(404).json(null);
	                }
	
	                // Fetch all projects
	                Project.find(function(err, projects) {
	                    if (err) {
	                        return res.status(500).json({
	                            message: 'Internal Server Error'
	                        });
	                    }
	
	                    res.render('../themes/default/portfolio.pug', {
	                        portfolioTitle: page.title,
	                        portfolioUrl: page.friendlyUrl,
	                        portfolioContent: page.content,
	                        projects: projects
	                    });
	                })
	            });
	        })
	
	
	       app.get('/default/*', function(req, res) {
	            console.log('default theme catch-all endpoint');
	            defaultHome = {};
	
	            res.redirect('/default/home/home');
	        }) 
	
	    // DEFAULT Theme endpoints go above here
	    // =====================================
	    });  
	    
	
	    // =====================================
	    // ADMIN SECTION =======================
	    // =====================================
	
	    app.get('/cms', isLoggedIn, function(req, res) {
	        console.log('logged in as: ' + req.user.local.name);
	        let data = {};
	        data.user = req.user;
	        data.view = 'home';
	        res.render('admin-layout.pug', {
	            user : data.user,
	            view : data.view 
	        });
	
	    // ---------------------- Admin endpoint seperator
	    // Endpoints to fetch all documents in Page, Project, and Skill collections
	
	        app.get('/cms/pages/get-pages', function(req, res) {
	            Page.find(function(err, pages) {
	                if (err) {
	                    return res.status(500).json({
	                        message: 'Internal Server Error'
	                    });
	                }
	
	                res.status(200).json(pages).end();
	            })
	        })
	
	        app.get('/cms/projects/get-projects', function(req, res) {
	            Project.find(function(err, projects) {
	                if (err) {
	                    return res.status(500).json({
	                        message: 'Internal Server Error'
	                    });
	                }
	                let fetchProjects = {
	                    projects: projects
	                };
	                Skill.find(function(err, skills) {
	                    if (err) {
	                        return res.status(500).json({
	                            message: 'Internal Server Error'
	                        });
	                    }
	
	                    let skillsArr = [];
	                    for ( let i = 0; i < skills.length; i++ ) {
	                        skillsArr.push(skills[i].skill);
	                    }
	                    fetchProjects.skills = skillsArr;
	
	                    res.status(200).json(fetchProjects).end();
	                });
	            });
	        });
	
	        app.get('/cms/skills/get-skills', function(req, res) {
	            Skill.find(function(err, skills) {
	                if (err) {
	                    return res.status(500).json({
	                        message: 'Internal Server Error'
	                    });
	                }
	                res.status(200).json(skills).end();
	            });
	        });
	
	    // Admin endpoint seperator ----------------------
	    // PAGE endpoints --------------------------------
	
	        app.post('/cms/pages/new-page', function(req, res) {
	            
	            Page.findOne({ title: req.body.title}, function(err, page) {
	
	                if (err) {
	                    return res.status(500);
	                }
	
	                if (req.body.title == '' || req.body.title == undefined) {
	                    return false;
	                }
	
	                if (page) {
	                    console.log(page.title + ' already exists');
	                    return res.status(200).redirect('/cms/pages/get-pages');
	                }
	
	                else {
	                    var page = new Page();
	                    page.title = req.body.title;
	                    page.friendlyUrl = req.body.friendlyUrl.trim().replace(/ /g, "_");
	                    page.content = req.body.content;
	                }
	    
	                page.save(function(err) {
	                    if (err) {
	                        res.status(500);
	                    }
	                    console.log('saved new page: ' + page.title);
	                    res.redirect('/cms/pages/get-pages');
	                });
	            })      
	        }) 
	    // ---------------------- Admin endpoint seperator
	    // ----------------------
	
	        app.post('/cms/pages/delete/:id', function(req, res) {
	            let id = req.body.id;
	            Page.findByIdAndRemove(id, function(err, page) {
	                if (err) {
	                    return res.status(500);
	                }
	                if (page) {
	                    console.log(page.title + ' deleted');
	
	                    res.redirect('/cms/pages/get-pages');
	                }
	            })
	        })
	
	    // ---------------------- Admin endpoint seperator
	    // ----------------------
	        app.post('/cms/pages/edit-page/:id', function(req, res) {
	
	            let id = req.body._id;
	            let updateObj = req.body;
	
	            Page.findByIdAndUpdate( id, updateObj, {new: true}, function(err, page) {
	
	                if (err) {
	                    return res.status(500);
	                }
	
	                if (id == '' || !id) {
	                    return false;
	                }
	
	                if (page) {
	                    console.log(page.title + ' found');  
	                    console.log('changes made ', page);
	                }
	    
	                page.save(function(err) {
	                    if (err) {
	                        res.status(500);
	                    }
	                    console.log('saved page: ' + page.title);
	                    res.redirect('/cms/pages/get-pages');
	                });
	            })      
	        })
	    // Admin endpoint seperator ---------------
	    // PROJECT endpoints ----------------------
	
	        app.post('/cms/projects/new-project', function(req, res) {
	            
	            Project.findOne({ name: req.body.name}, function(err, project) {
	
	                if (err) {
	                    return res.status(500);
	                }
	
	                if (req.body.name === '' || req.body.name == undefined) {
	                    return false;
	                }
	
	                if (project) {
	                    console.log(project.name + ' already exists');
	                    return res.status(200).redirect('/cms/projects/get-projects');
	                }
	
	                else {
	                    var project = new Project();
	                    project.name = req.body.name;
	                    project.friendlyUrl = req.body.friendlyUrl.trim().replace(/ /g, "_");
	                    project.image = req.body.image;
	                    project.livelink = req.body.livelink;
	                    project.codeUrl = req.body.codeUrl;
	                    project.description = req.body.description;
	                    project.skills = req.body.skills;
	                }
	    
	                project.save(function(err) {
	                    if (err) {
	                        res.status(500);
	                    }
	                    console.log('saved project: ' + project.name);
	                    res.redirect('/cms/projects/get-projects');
	                });
	            })      
	        }) 
	    // ---------------------- Admin endpoint seperator
	    // ----------------------
	
	        app.post('/cms/projects/delete/:id', function(req, res) {
	            let id = req.body.id;
	            Project.findByIdAndRemove(id, function(err, project) {
	                if (err) {
	                    return res.status(500);
	                }
	                if (project) {
	                    console.log(project.name + ' deleted');
	
	                    res.redirect('/cms/projects/get-projects');
	                }
	            })
	        })
	
	    // ---------------------- Admin endpoint seperator
	    // ----------------------
	
	        app.post('/cms/projects/edit-project/:id', function(req, res) {
	            
	            let id = req.body._id;
	            let updateObj = req.body;
	
	            Project.findByIdAndUpdate( id, updateObj, {new: true}, function(err, project) {
	
	                if (err) {
	                    return res.status(500);
	                }
	
	                if (id == '' || !id) {
	                    return false;
	                }
	
	                if (project) {
	                    console.log(project.name + ' found');  
	                    console.log('changes made ', project);
	                }
	    
	                project.save(function(err) {
	                    if (err) {
	                        res.status(500);
	                    }
	                    console.log('saved project: ' + project.name);
	                    res.redirect('/cms/projects/get-projects');
	                });
	            
	            })      
	        })
	
	    // Admin endpoint seperator -------------------
	    // SKILL endpoints ----------------------------
	
	        app.post('/cms/skills/new-skill', function(req, res) {
	                
	            Skill.findOne({ skill: req.body.skill}, function(err, skill) {
	
	                if (err) {
	                    return res.status(500);
	                }
	
	                if (req.body.skill == '') {
	                    return false;
	                }
	
	                if (skill) {
	                    console.log(skill.skill + ' already exists');
	                    return res.status(200).redirect('/cms/skills/get-skills');
	                }
	
	                let newskill = new Skill();
	                newskill.skill = req.body.skill;
	                
	                newskill.save(function(err) {
	                    if (err) {
	                        res.status(500);
	                    }
	                    console.log('saved new skill: ' + newskill.skill);
	                    res.redirect('/cms/skills/get-skills');
	                });
	            })      
	        }) 
	
	    // ---------------------- Admin endpoint seperator
	    // ----------------------
	
	        app.post('/cms/skills/delete/:id', function(req, res) {
	            let id = req.body.id;
	            Skill.findByIdAndRemove(id, function(err, skill) {
	                if (err) {
	                    return res.status(500);
	                }
	                if (skill) {
	                    console.log(skill.skill + ' deleted');
	                    
	                }
	                res.redirect('/cms/skills/get-skills');
	            })
	        })
	
	
	
	    // ====  Refresh page catch-all endpoint ========
	
	        app.get('/*', function(req, res) {
	            console.log('catch-all endpoint');
	
	            res.redirect('/cms');
	        })
	
	
	// ----------------
	// ---------------- Admin endpoints above this line
	// ----------------
	    });
	
	    // =====================================
	    // FACEBOOK ROUTES =====================
	    // =====================================
	    // 'public_profile' SHOULD be added to the scope, contrary to facebook developer documentation
	    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email', 'public_profile'] }));
	
	    app.get('/auth/facebook/callback',
	        passport.authenticate('facebook', {
	            successRedirect : '/cms',
	            failureRedirect : '/'
	        }));
	
	    // =====================================
	    // GITHUB ROUTES =======================
	    // =====================================
	    app.get('/auth/github', passport.authenticate('github', { scope : ['user', 'public_repo', 'repo'] }));
	
	    app.get('/auth/github/callback',
	        passport.authenticate('github', {
	            successRedirect : '/cms',
	            failureRedirect : '/'
	        }));
	
	    // =====================================
	    // LINKEDIN ROUTES =====================
	    // =====================================
	    app.get('/auth/linkedin', passport.authenticate('linkedin', { scope : ['r_emailaddress', 'r_basicprofile'] }));
	
	    app.get('/auth/linkedin/callback',
	        passport.authenticate('linkedin', {
	            successRedirect : '/cms',
	            failureRedirect : '/'
	        }));
	
	
	    // =====================================
	    // GOOGLE ROUTES =======================
	    // =====================================
	    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
	
	    app.get('/auth/google/callback',
	            passport.authenticate('google', {
	                    successRedirect : '/cms',
	                    failureRedirect : '/'
	            }));
	
	    // =====================================
	    // LOGOUT ==============================
	    // =====================================
	    app.get('/logout', function(req, res) {
	        req.logout();
	        res.redirect('/');
	    });
	};
	
	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next) {
	    if (req.isAuthenticated())
	        return next();
	    res.redirect('/');
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	const mongoose = __webpack_require__(4);
	const bcrypt = __webpack_require__(6);
	
	const pageSchema = new mongoose.Schema({
		title: String,
		friendlyUrl: String,
		content: String
	
	});
	
	module.exports = mongoose.model('Page', pageSchema);

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	const mongoose = __webpack_require__(4);
	const bcrypt = __webpack_require__(6);
	
	const projectSchema = new mongoose.Schema({
		name: String,
		friendlyUrl: String,
		image: String,
		livelink: String,
		codeUrl: String,
		description: String,
		skills: Array
	
	});
	
	module.exports = mongoose.model('Project', projectSchema);

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	const mongoose = __webpack_require__(4);
	const bcrypt = __webpack_require__(6);
	
	const skillSchema = new mongoose.Schema({
		skill: String
	
	});
	
	module.exports = mongoose.model('Skill', skillSchema);

/***/ }
/******/ ]);
//# sourceMappingURL=cms.1.0.0.js.map