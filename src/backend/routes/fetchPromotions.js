const express = require('express');
const Promotion = require('../models/Promotions'); // Import the Promotion model
const router = express.Router();

// Route to get all promotions
router.get('/promotions', async (req, res) => {
  try {
    const promotions = await Promotion.find(); // Fetch all promotions using Mongoose
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get a single promotion by ID
router.get('/promotions/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a new promotion
router.post('/promotions', async (req, res) => {
  const newPromotion = new Promotion({
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    discount: req.body.discount,
  });

  try {
    const savedPromotion = await newPromotion.save(); // Save the promotion to the database
    res.status(201).json(savedPromotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to update an existing promotion
router.put('/promotions/:id', async (req, res) => {
  try {
    // Update the promotion with new data
    const updatedPromotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPromotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    res.status(200).json(updatedPromotion);
  } catch (error) {
    console.error('Error updating promotion:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
