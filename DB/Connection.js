const mongoose = require('mongoose');
const uri =
	'mongodb+srv://kshem27:%53u%6Doni%6Bs%39%30%21@cluster0-hikom.mongodb.net/secretDiary?retryWrites=true&w=majority';
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
