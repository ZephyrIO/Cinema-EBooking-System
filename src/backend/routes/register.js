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

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      cardType,
      cardNumber,
      expirationDate,
      address: { street, city, state, zip },
      status: 'inactive', // New users are initially inactive
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Send confirmation email
    await sendConfirmationEmail(email);

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully. Please check your email for confirmation.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Function to send a confirmation email
async function sendConfirmationEmail(email) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'youremail@gmail.com',
      pass: 'yourpassword',
    },
  });

  const mailOptions = {
    from: 'youremail@gmail.com',
    to: email,
    subject: 'Registration Confirmation',
    text: 'Thank you for registering. Please log in to complete your registration.',
  };

  await transporter.sendMail(mailOptions);
}

module.exports = router;
