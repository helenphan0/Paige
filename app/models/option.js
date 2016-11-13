const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// use key for theme and value for name of theme

const optionsSchema = new mongoose.Schema({
	key: String,
	value: String

});

module.exports = mongoose.model('Option', optionsSchema);