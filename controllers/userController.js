const { validationResult } = require('express-validator');
const mongodb = require('../data/database');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const result = await mongodb.getDatabase().db('project2').collection('users').find();
        const users = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

const getSingleUser = async (req, res) => {
    //#swagger.tags=['Users']
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = new ObjectId(req.params.id);
        const user = await mongodb.getDatabase().db('project2').collection('users').findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
};

const createUser = async (req, res) => {
    //#swagger.tags=['Users']
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        };

        const response = await mongodb.getDatabase().db('project2').collection('users').insertOne(user);
        res.status(201).json({ message: 'User created', userId: response.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Some error occurred while creating the user', error: error.message });
    }
};

const updateUser = async (req, res) => {
    //#swagger.tags=['Users']
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = new ObjectId(req.params.id);
        
        // Check if user exists
        const existingUser = await mongodb.getDatabase().db('project2').collection('users').findOne({ _id: userId });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updates = {
            name: req.body.name || existingUser.name,
            email: req.body.email || existingUser.email,
        };

        // If the password is being updated, hash the new password
        if (req.body.password) {
            updates.password = await bcrypt.hash(req.body.password, 10);
        }

        const response = await mongodb.getDatabase().db('project2').collection('users').updateOne(
            { _id: userId },
            { $set: updates }
        );

        if (response.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Some error occurred while updating the user', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags=['Users']
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db('project2').collection('users').deleteOne({ _id: userId });

        if (response.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Some error occurred while deleting the user', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser
};
