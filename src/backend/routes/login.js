require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const userRouter = express.Router();

module.exports = userRouter;

JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Login a user
userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User with this email does not exist.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect password.' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Verify token validity
userRouter.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.json(false);

        const verified = jwt.verify(tokenParts[1], JWT_SECRET);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});