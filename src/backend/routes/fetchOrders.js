const express = require('express');
const Order = require('../models/Order'); // Import the Order model
const router = express.Router();

// Route to get all orders
router.get('/orders/:email', async (req, res) => {
    try {
      const orders = await Order.find({ email: req.params.email }); // Fetch all orders created by a certain user
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });