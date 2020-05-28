const Repository = require('./repository.js');

class ProductsRepo extends Repository {};

module.exports = new ProductsRepo('products.json');