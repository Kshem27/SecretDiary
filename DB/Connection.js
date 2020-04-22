const mongoose = require('mongoose');
const uri = 'mongodb+srv://kshem27:Sumoniks90!@cluster0-hikom.mongodb.net/secretDiary?retryWrites=true&w=majority';
var connectDB = async () => {
	await mongoose
		.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		})
		.then(() => {
			console.log('Connected To DB');
		})
		.catch((err) => {
			console.log(`ERROR: ${err.message}`);
		});
};
module.exports = connectDB;
