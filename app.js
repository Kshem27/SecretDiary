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
//INDEX ROUTE
app.get('/', (req, res) => {
	Idea.find({}, (err, allIdeas) => {
		if (err) {
			return console.log(err);
		}
		res.render('index', { ideas: allIdeas });
	});
});
//NEW
app.get('/new', (req, res) => {
	res.render('new');
});
//CREATE
app.post('/', (req, res) => {
	Idea.create(req.body.idea, (err, createdIdea) => {
		if (err) {
			return console.log(err);
		}
		console.log(createdIdea);
		res.redirect('/');
	});
});
//SHOW
app.get('/:id', (req, res) => {
	Idea.findById(req.params.id, (err, foundIdea) => {
		if (err) {
			console.log(err);
			return res.redirect('/');
		}
		console.log(foundIdea);
		res.render('show', { idea: foundIdea });
	});
});
//EDIT
app.get('/:id/edit', (req, res) => {
	Idea.findById(req.params.id, (err, foundIdea) => {
		if (err) {
			console.log(err);
			return res.redirect('/');
		}
		console.log(foundIdea);
		res.render('edit', { idea: foundIdea });
	});
});
//UPDATE
app.put('/:id', (req, res) => {
	Idea.findByIdAndUpdate(req.params.id, req.body.idea, (err, updatedIdea) => {
		if (err) {
			console.log(err);
			return res.redirect('/');
		}
		console.log(updatedIdea);
		res.redirect('/' + req.params.id);
	});
});
//DELETE
app.delete('/:id', (req, res) => {
	Idea.findByIdAndDelete(req.params.id, (err) => {
		if (err) {
			console.log(err);
			return res.redirect('/');
		}
		res.redirect('/');
	});
});
app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});
