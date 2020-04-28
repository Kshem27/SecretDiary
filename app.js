const express = require('express'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	localStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	flash = require('connect-flash'),
	PORT = process.env.PORT || 3000;
var connectDB = require('./DB/Connection'),
	app = express();
var Idea = require('./models/ideas'),
	User = require('./models/users');
connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(flash());
//PASSPORT CONFIGURATION
app.use(
	require('express-session')({
		secret: "Don't know what to write",
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user || null;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});
//ROUTES
var IdeaRoutes = require('./routes/ideas'),
	AuthRoutes = require('./routes/index');
app.use(IdeaRoutes);
app.use(AuthRoutes);
app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});
