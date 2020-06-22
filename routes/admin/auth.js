const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const UsersRepo = require('../../Repos/users.js');
const { validateEmail, 
		validatePassword, 
		confirmPassword,
		confirmEmailExistence,
		confirmPasswordExistenceForUser
  } = require('./validators.js');
const { handleValidationErrors } = require('./middlewares');
let errors;

router.get('/signup', (req, res) => {
	errors = null;
	res.render('admin/signup.ejs', {errors});
});


router.post('/signup',
	 [
		validateEmail,
		validatePassword,
		confirmPassword
	],
	handleValidationErrors('admin/products/new'),
	 async (req, res) => {

	 	try {	
			
			const { email, password, passwordConfirmation } = req.body;

			const newUser = UsersRepo.createUser({email, password});
			// We're using the ID of the user to set the cookie encryption key
			req.session.userId = newUser.id;

			res.redirect('/admin/products');
	 	}
	 	catch(err) {
	 		next(err);
	 	}
});

router.get('/signin', (req, res) => {
	errors = null;
	res.render('admin/signin.ejs', { errors });
});

router.post('/signin', [
			confirmEmailExistence,
			confirmPasswordExistenceForUser
		], 
		handleValidationErrors('admin/products/new'),
		async (req, res) => {

	const { email } = req.body;

	const user = await UsersRepo.getByFilters({email});

	req.session.userId = user.id;

	res.redirect('/admin/products');
});


router.get('/signout', (req, res) => {
	req.session = null;
	res.send(`You have been logged out`);
});

module.exports = router;