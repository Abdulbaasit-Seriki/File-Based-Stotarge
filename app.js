const express = require('express');
const bodyParser = require('body-parser');
const UsersRepo = require('./Repos/users.js');
const cookieSession = require('cookie-session');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
	keys: ['lajsuh8lns']
}));

app.get('/signup', (req, res) => {
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

app.post('/signup', async (req, res) => {
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

app.get('/signout', (req, res) => {
	req.session = null;
	res.send(`You have been logged out`);
});

app.get('/signin', (req, res) => {
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

app.post('/signin', async (req, res) => {
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


const port = process.env.PORT || 3000;
app.listen(port, console.log(`Server Running on port ${port}`))