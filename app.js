const express = require('express'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	localStrategy = require('passport-local'),
	methodOverride = require('method-override'),
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
	next();
});
//IDEA ROUTES
app.get('/', (req, res) => {
	res.redirect('/login');
});
//INDEX ROUTE
app.get('/ideas', isLoggedIn, (req, res) => {
	Idea.find({}, (err, allIdeas) => {
		if (err) {
			return console.log(err);
		}
		res.render('index', { ideas: allIdeas });
	});
});
//NEW
app.get('/ideas/new', isLoggedIn, (req, res) => {
	res.render('new');
});
//CREATE
app.post('/ideas', isLoggedIn, (req, res) => {
	Idea.create(req.body.idea, (err, createdIdea) => {
		if (err) {
			return console.log(err);
		}
		createdIdea.author.id = req.user._id;
		createdIdea.author.username = req.user.username;
		createdIdea.save();
		console.log(createdIdea);
		res.redirect('/ideas');
	});
});
//SHOW
app.get('/ideas/:id', (req, res) => {
	Idea.findById(req.params.id, (err, foundIdea) => {
		if (err) {
			console.log(err);
			return res.redirect('/ideas');
		}
		console.log(foundIdea);
		res.render('show', { idea: foundIdea });
	});
});
//EDIT
app.get('/ideas/:id/edit', (req, res) => {
	Idea.findById(req.params.id, (err, foundIdea) => {
		if (err) {
			console.log(err);
			return res.redirect('/ideas');
		}
		console.log(foundIdea);
		res.render('edit', { idea: foundIdea });
	});
});
//UPDATE
app.put('/ideas/:id', (req, res) => {
	Idea.findByIdAndUpdate(req.params.id, req.body.idea, (err, updatedIdea) => {
		if (err) {
			console.log(err);
			return res.redirect('/');
		}
		console.log(updatedIdea);
		res.redirect('/ideas/' + req.params.id);
	});
});
//DELETE
app.delete('/ideas/:id', (req, res) => {
	Idea.findByIdAndDelete(req.params.id, (err) => {
		if (err) {
			console.log(err);
			return res.redirect('/ideas');
		}
		res.redirect('/ideas');
	});
});
//AUTH ROUTES
//Registeration form
app.get('/register', (req, res) => {
	res.render('register');
});
//REGISTER LOGIC
app.post('/register', (req, res) => {
	var newUser = new User({
		username: req.body.username
	});
	User.register(newUser, req.body.password, (err, createdUser) => {
		if (err) {
			console.log(err);
			return res.redirect('/ideas');
		}
		passport.authenticate('local')(req, res, () => {
			res.redirect('/ideas');
		});
	});
});
//login routes
app.get('/login', (req, res) => {
	res.render('login');
});
//login logic
app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/ideas',
		failureRedirect: '/register',
		failureMessage: 'Login Failed'
	}),
	(req, res) => {}
);
//logout
app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});
app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/ideas');
}
