const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const skillSchema = new mongoose.Schema({
	skill: String

});

module.exports = mongoose.model('Skill', skillSchema);