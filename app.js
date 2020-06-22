const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const ejs = require('ejs');
const app = express();

// Route files
const authRoute = require('./routes/admin/auth.js');
const productsRoute = require('./routes/admin/products.js');

// Middlewares
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
	keys: ['lajsuh8lns']
}));
app.set('view engine', "ejs");

// Mount Routers
app.use(authRoute);
app.use(productsRoute);

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Server Running on port ${port}`))