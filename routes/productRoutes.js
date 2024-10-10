// src/routes/productRoutes.js
const express = require('express');
const { createProduct, getAllProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const validateProduct = require('../middleware/validateProduct');

const router = express.Router();

router.post('/', validateProduct, createProduct);
router.get('/', getAllProducts);
router.put('/:id', validateProduct, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
