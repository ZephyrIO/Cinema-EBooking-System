const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const router = express.Router();

// POST route for user registration
router.post('/register', async (req, res) => {
    const { email, password, name, phone, cardType, cardNumber, expirationDate, street, city, state, zip } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedCardNumber = await bcrypt.hash(cardNumber, 10);
        const hashedExpirationDate = await bcrypt.hash(expirationDate, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            phone,
            cardType,
            cardNumber: hashedCardNumber,
            expirationDate: hashedExpirationDate,
            address: { street, city, state, zip },
            status: 'inactive',
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Send confirmation email
        try {
            await sendConfirmationEmail(email);
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Respond with a warning but not fail registration due to email issue
            return res.status(201).json({ 
                message: 'User registered successfully, but confirmation email failed to send', 
                userId: savedUser._id 
            });
        }

        // Respond with success if everything goes well
        return res.status(201).json({ message: 'User registered successfully', userId: savedUser._id });
    } catch (error) {
        // If something went wrong, return an error
        return res.status(500).json({ message: 'Error registering user', error });
    }
});

// Function to send a confirmation email
async function sendConfirmationEmail(email) {
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
      subject: 'Registration Confirmation',
      text: 'Thank you for registering! You can now log in and complete your profile.',
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Confirmation email sent to ' + email);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error sending confirmation email');
    }
  }
  

module.exports = router;
