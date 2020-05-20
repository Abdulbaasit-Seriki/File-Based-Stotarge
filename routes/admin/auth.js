const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const UsersRepo = require('../../Repos/users.js');

const { validateEmail, validatePassword, confirmPassword } = require('./validators.js');

const {
	showSignupForm,
	signUp,
	signOut,
	showSignInForm,
	signIn
} = require('../../controllers/auth.js');

router.post('/signup',
	 [
		validateEmail,
		validatePassword,
		confirmPassword
	],
	 async (req, res) => {

	 	try {	
	 		const errors = validationResult(req);
	 		console.log(errors);
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
})

router.route('/signup').get(showSignupForm);
router.route('/signin').get(showSignInForm).post(signIn);
router.route('/signout').get(signOut);

module.exports = router;