const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); 
const auth = require('../middleware/auth'); 
const router = express.Router();

// Route to update a user's profile
router.put('/users', auth, async (req, res) => {
  const { name, phone, password, cardType, cardNumber, expirationDate, street, city, state, zip, promotions, paymentCards } = req.body;

  console.log('Received profile update request:', req.body); // Log the incoming request for debugging

  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log what is about to be updated
    console.log('Updating user:', user.email);

    // Update fields (email is not modifiable)
    user.name = name || user.name;
    user.phone = phone || user.phone;

    // Update the password only if a new one is provided
    if (password && password !== user.password) {
      user.password = await bcrypt.hash(password, 10); // Hash the new password
    }

    // Update address and card details (ensure only one address and max 4 cards)
    user.address = { street, city, state, zip };
    user.paymentCards = (paymentCards && paymentCards.length > 0) ? paymentCards.slice(0, 4) : user.paymentCards;

    user.promotions = promotions !== undefined ? promotions : user.promotions;

    const updatedUser = await user.save(); // Save the user with new details
    console.log('Profile successfully updated for:', user.email);
    res.json(updatedUser); // Send back updated user profile
  } catch (error) {
    console.error('Error updating profile:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error updating profile.', error });
  }
});
router.get('/users', auth, async (req, res) => {
  try {
    console.log('Authenticated user ID:', req.user); // Log the user ID from token
    const user = await User.findById(req.user); // Fetch the user by ID from the token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log user details before sending them to the frontend
    console.log('Fetched user data:', user);

    // Make sure address fields and paymentCards are available
    if (!user.paymentCards) {
      user.paymentCards = []; // Initialize paymentCards if it's missing
    }
    if (!user.address) {
      user.address = { street: '', city: '', state: '', zip: '' }; // Initialize address fields
    }

    res.json({
      name: user.name,
      phone: user.phone,
      email: user.email,
      street: user.address.street,
      city: user.address.city,
      state: user.address.state,
      zip: user.address.zip,
      paymentCards: user.paymentCards,
      promotions: user.promotions
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
