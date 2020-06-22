const express = require('express');
const multer = require('multer');

const productsRepo = require('../../Repos/products');
const { validateProductTitle, validateProductPrice } = require('./validators');
const { handleValidationErrors, requireAuth } = require('./middlewares');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
let errors;

router.get('/admin/products', requireAuth, async (req, res) => {
	const products = await productsRepo.getAll();
	res.render('admin/products/index', { products });
});

router.get('/admin/products/new', requireAuth, (req, res) => {
  res.render('admin/products/new', {errors: null});
});

router.post(
  '/admin/products/new',
  requireAuth,
  upload.single('image'),
  [validateProductTitle, validateProductPrice],
  handleValidationErrors('admin/products/new'),
  async (req, res) => {
    
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    res.redirect('/admin/products');
  }
);

router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
	const product = await productsRepo.getById(req.params.id);

	if (!product) {
		return res.send(`Product not found`);
	}
	res.render('admin/products/edit', { product });
})

module.exports = router;
