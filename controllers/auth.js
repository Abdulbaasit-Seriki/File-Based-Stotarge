const UsersRepo = require('../Repos/users.js');
const { check, validationResult } = require('express-validator');

exports.showSignupForm = ('/signup', (req, res, next) => {
	res.render('admin/signup.ejs', {req});
});

exports.signUp = ('/signup',
	 [
		check('email').trim().normalizeEmail().isEmail(),
		check('password').trim().isLength({ min: 6, max: 40 }),
		check('passwordConfirmation').trim().isLength({ min: 6, max: 40 })
	],
	 async (req, res, next) => {

	 	try {	
	 		const errors = validationResult(req);
			console.log(errors); 
			
			const { email, password, passwordConfirmation } = req.body;

			const foundUser = await UsersRepo.getByFilters({email});
			if (foundUser) {
				res.send(`This Email has been associated with an account, kindly pick another`);
			}

			if (password !== passwordConfirmation) {
				res.send(`Passwords must match`)
			}

			const newUser = UsersRepo.createUser({email, password});
			// We're using the ID of the user to set the cookie encryption key
			req.session.userId = newUser.id;

			res.send(`Account Created Successfully`);
	 	}
	 	catch(err) {
	 		next(err);
	 	}
})

exports.signOut = ('/signout', (req, res) => {
	req.session = null;
	res.send(`You have been logged out`);
});

exports.showSignInForm = ('/signin', (req, res) => {
	res.render('admin/signin.ejs', {req});
});

exports.signIn = ('/signin', async (req, res) => {
	const {email, password} = req.body;

	const user = await UsersRepo.getByFilters({email});
	if (!user) {
		return res.send(`EmailNot Found`);
	}

	const correctPassword = await UsersRepo.comparePasswords(user.password, password);

	if (!correctPassword) {
		return res.send(`Incorrect Password`);
	}

	req.session.userId = user.id;

	res.send(`You are logged in with an ID of ${req.session.userId}`);
});
