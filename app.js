const express = require('express');
var connectDB = require('./DB/Connection');
const PORT = process.env.PORT || 3000;
var app = express();
connectDB();
app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});
