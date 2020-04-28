const express = require('express');
var router = express.Router();
var Idea = require('../models/ideas');
//IDEA ROUTES
router.get('/', (req, res) => {
	res.redirect('/login');
});
//INDEX ROUTE
router.get('/ideas', isLoggedIn, (req, res) => {
	Idea.find({}, (err, allIdeas) => {
		if (err) {
			return console.log(err);
		}
		res.render('ideas/index', { ideas: allIdeas });
	});
});
//NEW
router.get('/ideas/new', isLoggedIn, (req, res) => {
	res.render('ideas/new');
});
//CREATE
router.post('/ideas', isLoggedIn, (req, res) => {
	Idea.create(req.body.idea, (err, createdIdea) => {
		if (err) {
			req.flash('error', err.message);
			return res.redirect('ideas');
		}
		createdIdea.author.id = req.user._id;
		createdIdea.author.username = req.user.username;
		createdIdea.save();
		req.flash('success', 'Congrats!! You Created a new Chapter');
		console.log(createdIdea);
		res.redirect('/ideas');
	});
});
//SHOW
router.get('/ideas/:id', isLoggedIn, (req, res) => {
	Idea.findById(req.params.id, (err, foundIdea) => {
		if (err) {
			console.log(err);
			return res.redirect('/ideas');
		}
		console.log(foundIdea);
		res.render('ideas/show', { idea: foundIdea });
	});
});
//EDIT
router.get('/ideas/:id/edit', isLoggedIn, (req, res) => {
	Idea.findById(req.params.id, (err, foundIdea) => {
		if (err) {
			console.log(err);
			return res.redirect('/ideas');
		}
		console.log(foundIdea);
		res.render('ideas/edit', { idea: foundIdea });
	});
});
//UPDATE
router.put('/ideas/:id', isLoggedIn, (req, res) => {
	Idea.findByIdAndUpdate(req.params.id, req.body.idea, (err, updatedIdea) => {
		if (err) {
			console.log(err);
			return res.redirect('/');
		}
		console.log(updatedIdea);
		req.flash('success', 'Successfully Updated a Chapter!!');
		res.redirect('/ideas/' + req.params.id);
	});
});
//DELETE
router.delete('/ideas/:id', isLoggedIn, (req, res) => {
	Idea.findByIdAndDelete(req.params.id, (err) => {
		if (err) {
			console.log(err);
			return res.redirect('/ideas');
		}
		res.redirect('/ideas');
	});
});
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}
module.exports = router;
