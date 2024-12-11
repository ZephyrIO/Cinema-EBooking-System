const express = require('express');
const Order = require('../models/Order'); // Import the Order model
const router = express.Router();

// Route to get all orders
router.get('/orders/', async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;