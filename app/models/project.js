const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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