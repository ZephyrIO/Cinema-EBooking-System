const express = require('express');
const User = require('../models/User'); 
const auth = require('../middleware/auth'); 
const router = express.Router();

// Route to get the logged-in user's profile
// Route to get the logged-in user's profile
// Route to get the logged-in user's profile
router.get('/users', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user); // Fetch the user by ID from the token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.paymentCards) {
      user.paymentCards = []; // Ensure paymentCards is an array if not present
    }
    console.log("User data:", user); // Log user data to verify

    res.json(user); // Return user data
  } catch (error) {
    console.error("Error fetching user:", error); // Log any errors
    res.status(500).json({ message: error.message });
  }
});



// Route to update a user's profile
router.put('/users', async (req, res) => {
  const { name, phone, password, cardType, cardNumber, expirationDate, street, city, state, zip, promotions, paymentCards } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields (email is not modifiable)
    user.name = name;
    user.phone = phone;
    if (password) {
      user.password = await bcrypt.hash(password, 10); // Hash the new password if provided
    }

    // Address and card details (ensure only one address and max 4 cards)
    user.address = { street, city, state, zip };
    user.paymentCards = paymentCards.slice(0, 4); // Limit to 4 payment cards

    user.promotions = promotions; // Register/unregister for promotions

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
