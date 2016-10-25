const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const pageSchema = new mongoose.Schema({
	title: String,
	friendlyUrl: String,
	content: String

});

module.exports = mongoose.model('Page', pageSchema);