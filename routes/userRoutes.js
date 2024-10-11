const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const usersController = require('../controllers/userController');

// Validation rules for creating a user
const userValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Validation for the user ID in URL params
const userIdValidation = [
    param('id').isMongoId().withMessage('Invalid user ID format')
];

// Routes
router.get('/', usersController.getAllUsers);

router.get('/:id', userIdValidation, usersController.getSingleUser);

router.post('/', userValidationRules, usersController.createUser);

router.delete('/:id', userIdValidation, usersController.deleteUser);

module.exports = router;
