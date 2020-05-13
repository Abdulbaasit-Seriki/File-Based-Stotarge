const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRoute = require('./routes/admin/auth.js');
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
	keys: ['lajsuh8lns']
}));

// Mount Routers
app.use(authRoute);

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Server Running on port ${port}`))