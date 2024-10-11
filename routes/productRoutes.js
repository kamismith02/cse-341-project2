const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const productsController = require('../controllers/productControllers');

// Validation rules for creating and updating a product
const productValidationRules = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('supplier').notEmpty().withMessage('Supplier is required')
];

// Validation for the product ID in URL params
const productIdValidation = [
    param('id').isMongoId().withMessage('Invalid product ID format')
];

// Routes with validation
router.get('/', productsController.getAll);

router.get('/:id', productIdValidation, productsController.getSingle);

router.post('/', productValidationRules, productsController.createProduct);

router.put('/:id', [...productIdValidation, ...productValidationRules], productsController.updateProduct);

router.delete('/:id', productIdValidation, productsController.deleteProduct);

module.exports = router;
