const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); 
const auth = require('../middleware/auth'); 
const router = express.Router();

/**
 * Route: Update a user's profile
 * Requires Authentication
 */
router.put('/users', auth, async (req, res) => {
  const {
    name, phone, password, street, city, state, zip, promotions, paymentCards
  } = req.body;

  console.log('Received profile update request:', req.body);

  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Updating user:', user.email);

    // Update user fields (email is not modifiable)
    user.name = name || user.name;
    user.phone = phone || user.phone;

    // Update password if provided and different from current one
    if (password && password !== user.password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Update address and card details (ensure max 4 cards)
    user.address = { street, city, state, zip };
    user.paymentCards = (paymentCards && paymentCards.length > 0)
      ? paymentCards.slice(0, 4)
      : user.paymentCards;

    user.promotions = promotions !== undefined ? promotions : user.promotions;

    const updatedUser = await user.save();
    console.log('Profile successfully updated for:', user.email);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile.', error });
  }
});

/**
 * Route: Get a specific user's profile
 * Requires Authentication
 */
router.get('/users', auth, async (req, res) => {
  try {
    console.log('Authenticated user ID:', req.user);
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Fetched user data:', user);

    res.json({
      name: user.name,
      phone: user.phone,
      email: user.email,
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zip: user.address?.zip || '',
      paymentCards: user.paymentCards || [],
      promotions: user.promotions || false,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * Route: Get all users
 * Requires Authentication
 */
router.get('/all-users', auth, async (req, res) => {
  try {
    console.log('Fetching all users'); // Debug log
    const users = await User.find(); // Fetch all users
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

/**
 * Route: Get all users (Public access, no auth)
 * Note: Use only for testing or development purposes
 */
router.get('/public-users', async (req, res) => {
  try {
    console.log('Fetching all users without auth'); // Debug log
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

/**
 * Route: Grant Admin to a user
 * Requires Authentication and Admin privilege
 */
router.put('/users/grant-admin/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;

    // Make sure the current user is an admin
    const adminUser = await User.findById(req.user);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized, only admins can perform this action.' });
    }

    // Find the user to be updated
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Grant admin privileges
    userToUpdate.isAdmin = true;
    await userToUpdate.save();

    res.json({ message: 'User granted admin privileges successfully.', user: userToUpdate });
  } catch (error) {
    console.error('Error granting admin privileges:', error);
    res.status(500).json({ message: 'Error granting admin privileges.', error });
  }
});

// Backend - Remove Admin route
router.put('/users/remove-admin/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId); // Ensure userId is a valid ObjectId
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.isAdmin = false; // Remove admin privileges
    await user.save();
    res.json({ message: 'User removed from admin privileges.', user });
  } catch (err) {
    res.status(500).json({ message: 'Error removing admin privileges.', error: err });
  }
});

// DELETE /api/users/:id
router.delete('/users/delete/:id', auth, async (req, res) => {
  const { id } = req.params;
  console.log('Delete Request for user ID:', id); // Log the received user ID

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting user.' });
  }
});



module.exports = router;
