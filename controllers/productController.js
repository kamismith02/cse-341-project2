const { validationResult } = require('express-validator');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Products']
    try {
        const result = await mongodb.getDatabase().db('project2').collection('products').find();
        const products = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Products']
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const productId = new ObjectId(req.params.id);
        const product = await mongodb.getDatabase().db('project2').collection('products').findOne({ _id: productId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving product', error: error.message });
    }
};

const createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const product = {
        name: req.body.name,
        description: req.body.description,
        quantity: req.body.quantity,
        price: req.body.price,
        category: req.body.category,
        supplier: req.body.supplier,
        userId: new ObjectId(req.body.userId)  // associate product with user
    };

    try {
        const response = await mongodb.getDatabase().db('project2').collection('products').insertOne(product);
        res.status(201).json({ message: 'Product created', productId: response.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Some error occurred while creating the product', error: error.message });
    }
};

const updateProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const productId = new ObjectId(req.params.id);
        const product = {
            name: req.body.name,
            description: req.body.description,
            quantity: req.body.quantity,
            price: req.body.price,
            category: req.body.category,
            supplier: req.body.supplier,
            userId: new ObjectId(req.body.userId)  // ensure userId is included in updates
        };

        const response = await mongodb.getDatabase().db('project2').collection('products').replaceOne({ _id: productId }, product);

        if (response.modifiedCount === 0) {
            return res.status(404).json({ message: 'Product not found or no changes made' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Some error occurred while updating the product', error: error.message });
    }
};


const deleteProduct = async (req, res) => {
    //#swagger.tags=['products']
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const productId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db('project2').collection('products').deleteOne({ _id: productId });

        if (response.deletedCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Some error occurred while deleting the product', error: error.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createProduct,
    updateProduct,
    deleteProduct
};
