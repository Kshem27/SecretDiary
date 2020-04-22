const mongoose = require('mongoose');
var ideaSchema = new mongoose.Schema({
	title: String,
	content: String
});
module.exports = mongoose.model('Idea', ideaSchema);
