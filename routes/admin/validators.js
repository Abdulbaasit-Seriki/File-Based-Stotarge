const { check, validationResult } = require('express-validator');
const UsersRepo = require('../../Repos/users.js');

module.exports = {
	validateEmail: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Please enter a valid Email')
		.custom( async email => {

			const foundUser = await UsersRepo.getByFilters({email});
			if (foundUser) {
				throw new Error(`This Email has been associated with an account, kindly pick another`);
			}			
		}),

	validatePassword: check('password')
		.trim()
		.isLength({ min: 6, max: 40 })
		.withMessage("Password must be between 6 and 40 characters"),

	confirmPassword: check('passwordConfirmation')
		.trim()
		.isLength({ min: 6, max: 40 })
		.withMessage("Password must be between 6 and 40 characters")
		.custom( (passwordConfirmation, { req }) => {

			if (passwordConfirmation !== req.body.password ) {
				throw new Error(`Passwords must match`)
			}
		}),

	confirmEmailExistence: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage(`Please Enter A Valid Email`)
		.custom( async (email) => {
			const user = await UsersRepo.getByFilters({email});

			if (!user) {
				throw new Error(`Email not Found`);
			}
		}),

	confirmPasswordExistenceForUser: check('password')
		.trim()
		.custom(async (password, { req }) => {

			// I'm still checking for the user here just in case of anything
			const user = await UsersRepo.getByFilters({ email: req.body.email });

			if (!user) {
				throw new Error(`Email not Found`);
			}

			const correctPassword = await UsersRepo.comparePasswords(user.password, password);

			if (!correctPassword) {
				throw new Error(`Incorrect Password`);
			}

		}),

	validateProductTitle: check('title')
		.trim()
		.isLength({ min: 5, max: 30 })
		.withMessage(`Title must be between 5 and 30 characters`),

	validateProductPrice: check('price')
		.trim()
		.toFloat()
		.isFloat({ min: 1 })
		.withMessage(`Price must be a number`)
}