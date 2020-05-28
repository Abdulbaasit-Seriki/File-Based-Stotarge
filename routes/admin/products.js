const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const ProductsRepo = require('../../Repos/products.js');
const { validateProductTitle, validateProductPrice } = require('./validators.js');

router.get('/', (req, res) => {

});

router.get('/new', (req, res) => {
	res.render('admin/products/new');
});

router.post('/new', [validateProductTitle, validateProductPrice], (req, res) => {
	const errors = validationResult(req);
	console.log(errors);
	res.send(`Submitted`);
});

module.exports = router;