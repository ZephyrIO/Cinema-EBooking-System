const express = require('express');
const User = require('../models/User'); // Import the User model
const router = express.Router();

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users using Mongoose
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a new user
router.post('/users', async (req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
    cardType: req.body.cardType,
    cardNumber: req.body.cardNumber,
    expirationDate: req.body.expirationDate,
    address: {
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip
    }
  });

  try {
    const savedUser = await newUser.save(); // Save the user to the database
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;