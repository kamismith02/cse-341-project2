// src/middleware/validateProduct.js
const validateProduct = (req, res, next) => {
    const { name, description, quantity, price, category, supplier } = req.body;

    if (!name || !description || quantity < 0 || price < 0 || !category || !supplier) {
        return res.status(400).json({ message: 'All fields are required and quantity/price must be non-negative.' });
    }

    next();
};

module.exports = validateProduct;
