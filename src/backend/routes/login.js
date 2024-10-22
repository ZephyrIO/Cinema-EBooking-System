require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const nodemailer = require('nodemailer');
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

userRouter.post('/forgot', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User with this email does not exist.' });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
            },
        });

        try {
            await sendResetEmail(email)
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Respond with a warning due to email not being sent
            return res.status(201).json({ 
                message: 'User exists, but email failed to send', 
                userId: savedUser._id 
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Function to send a password reset email
async function sendResetEmail(email) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || '4050testemail@gmail.com',
            pass: process.env.EMAIL_PASS || '4050test', // Use app password if 2FA is enabled
        },
        logger: true, // Enable logging
        debug: true,  // Include more detailed logs
    });
    
    const mailOptions = {
        from: '4050testemail@gmail.com',
        to: email,
        subject: 'Forgot Password',
        text: `Click the following link to reset your password`,
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log('Reset email sent to ' + email);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending reset email');
    }
};