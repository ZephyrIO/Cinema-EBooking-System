const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * Route: Update a user's profile
 * Requires Authentication
 */
router.put('/users/update/:id', auth, async (req, res) => {
  const targetUserId = req.params.id;

  try {
    // Ensure the authenticated user is an admin
    const adminUser = await User.findById(req.user);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized, only admins can update other users.' });
    }

    // Find the target user by ID
    const userToUpdate = await User.findById(targetUserId);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Extract fields to update from the request body
    const {
      name, phone, password, street, city, state, zip, promotions, paymentCards
    } = req.body;

    // Update user fields
    userToUpdate.name = name || userToUpdate.name;
    userToUpdate.phone = phone || userToUpdate.phone;

    // Update password if provided
    if (password && password !== userToUpdate.password) {
      userToUpdate.password = await bcrypt.hash(password, 10);
    }

    // Update address
    userToUpdate.address = {
      street: street || userToUpdate.address.street,
      city: city || userToUpdate.address.city,
      state: state || userToUpdate.address.state,
      zip: zip || userToUpdate.address.zip,
    };

    // Update payment cards (max 4)
    userToUpdate.paymentCards = paymentCards ? paymentCards.slice(0, 4) : userToUpdate.paymentCards;

    // Update promotions
    userToUpdate.promotions = promotions !== undefined ? promotions : userToUpdate.promotions;

    // Save updated user
    const updatedUser = await userToUpdate.save();
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user.', error });
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
  console.log('Request received for user update:', req.params.id);
  console.log('Request body:', req.body);
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
  console.log('Delete Request for user ID:', id);

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user.' });
  }
});

router.put('/users/suspend/:id', auth, async (req, res) => {
  try {
      const { id } = req.params;

      // Ensure the authenticated user is an admin
      const adminUser = await User.findById(req.user);
      if (!adminUser || !adminUser.isAdmin) {
          return res.status(403).json({ msg: 'Unauthorized, only admins can suspend users.' });
      }

      // Find the target user by ID
      const userToSuspend = await User.findById(id);
      if (!userToSuspend) {
          return res.status(404).json({ msg: 'User not found.' });
      }

      // Set the suspended field to true
      userToSuspend.suspended = true;

      // Save the updated user data
      await userToSuspend.save();

      // Respond with the updated user
      res.status(200).json({ msg: 'User suspended successfully.', user: userToSuspend });
  } catch (err) {
      console.error('Error suspending user:', err);
      res.status(500).json({ msg: 'Error suspending user.', error: err.message });
  }
});

router.put('/users/unsuspend/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the authenticated user is an admin
    const adminUser = await User.findById(req.user);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ msg: 'Unauthorized, only admins can unsuspend users.' });
    }

    // Find the target user by ID
    const userToUnsuspend = await User.findById(id);
    if (!userToUnsuspend) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    // Set the suspended field to false
    userToUnsuspend.suspended = false;

    // Save the updated user data
    await userToUnsuspend.save();

    // Respond with the updated user
    res.status(200).json({ msg: 'User unsuspended successfully.', user: userToUnsuspend });
  } catch (err) {
    console.error('Error unsuspending user:', err);
    res.status(500).json({ msg: 'Error unsuspending user.', error: err.message });
  }
});

module.exports = router;
