const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Login a user
router.post('/login', async (req, res) => {
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