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

const {
	showSignupForm,
	signUp,
	signOut,
	showSignInForm,
	signIn
} = require('../../controllers/auth.js');

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
	 async (req, res) => {

	 	try {	
	 		errors = validationResult(req);
	 		
			if (!errors.isEmpty()) {
				return res.render('admin/signup.ejs', { errors })
			}
			
			const { email, password, passwordConfirmation } = req.body;

			const newUser = UsersRepo.createUser({email, password});
			// We're using the ID of the user to set the cookie encryption key
			req.session.userId = newUser.id;

			res.send(`Account Created Successfully`);
	 	}
	 	catch(err) {
	 		next(err);
	 	}
});

router.get('/signin', (req, res) => {
	errors = null;
	res.render('admin/signin.ejs', { req, errors });
});

router.post('/signin', [
			confirmEmailExistence,
			confirmPasswordExistenceForUser
		], async (req, res) => {

	errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.render('admin/signin.ejs', { req, errors });
	}

	const { email } = req.body;

	const user = await UsersRepo.getByFilters({email});

	req.session.userId = user.id;

	res.send(`You are logged in with an ID of ${req.session.userId}`);
});


router.route('/signout').get(signOut);

module.exports = router;