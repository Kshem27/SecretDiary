const express = require('express'),
	passport = require('passport');
var router = express.Router();
var User = require('../models/users');
//AUTH ROUTES
//Registeration form
router.get('/register', (req, res) => {
	res.render('auth/register');
});
//REGISTER LOGIC
router.post('/register', (req, res) => {
	var newUser = new User({
		username: req.body.username
	});
	User.register(newUser, req.body.password, (err, createdUser) => {
		if (err) {
			console.log(err);
			req.flash('error', err.message);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req, res, () => {
			req.flash('success', `Welcome To Secret Diary ${createdUser.username}`);
			res.redirect('/ideas');
		});
	});
});
//login routes
router.get('/login', (req, res) => {
	res.render('auth/login');
});
//login logic
router.post(
	'/login',
	passport.authenticate('local', {
		failureRedirect: '/login',
		failureFlash: true
	}),
	(req, res) => {
		req.flash('success', 'SuccessFully Logged You In!!');
		res.redirect('/ideas');
	}
);
//logout
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Logged You Out!!');
	res.redirect('/login');
});
module.exports = router;
