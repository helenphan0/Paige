const express = require('express');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const configDB = require('./config/database.js');

if(typeof configDB.url === 'undefined'){
	console.log('This appears to be your first time running Paige, please configure your database in the config/database.js file');
	process.exit();
}

mongoose.Promise = global.Promise;
mongoose.connect(configDB.url);

require('./config/passport')(passport);

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

require('./app/routes.js')(app, passport);

app.listen(process.env.PORT || 8080, function() {
    console.log('Server started at http://localhost:8080');
});


