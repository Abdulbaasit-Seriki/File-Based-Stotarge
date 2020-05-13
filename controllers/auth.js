const UsersRepo = require('../Repos/users.js');
const signUpTemplate = require('../views/admin/signup.js');
const signInTemplate = require('../views/admin/signin.js');

exports.showSignupForm = ('/signup', (req, res) => {
	// res.send(signUpTemplate({ req }));
	res.send(`
	    <div>
	    	Current User ID = ${req.session.userId}
		      <form method="POST">
		        <input name="email" placeholder="email" />
		        <input name="password" placeholder="password" />
		        <input name="passwordConfirmation" placeholder="password confirmation" />
		        <button>Sign Up</button>
		      </form>
	    </div>
  `);
});

exports.signUp = ('/signup', async (req, res) => {
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
})

exports.signOut = ('/signout', (req, res) => {
	req.session = null;
	res.send(`You have been logged out`);
});

exports.showSignInForm = ('/signin', (req, res) => {
	// res.send(signInTemplate({ req }));
	res.send(`
	   <div>
	    Current User ID = ${req.session.userId}
	      <form method="POST">
	        <input name="email" placeholder="email" />
	        <input name="password" placeholder="password" />
	        <button>Sign In</button>
	      </form>
	    </div>
  `);
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
