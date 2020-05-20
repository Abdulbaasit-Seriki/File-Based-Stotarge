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
		})
}