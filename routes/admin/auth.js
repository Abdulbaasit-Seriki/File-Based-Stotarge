const express = require('express');
const router = express.Router();

const {
	showSignupForm,
	signUp,
	signOut,
	showSignInForm,
	signIn
} = require('../../controllers/auth.js');

router.route('/signup').get(showSignupForm).post(signUp);
router.route('/signin').get(showSignInForm).post(signIn);
router.route('/signout').get(signOut);

module.exports = router;