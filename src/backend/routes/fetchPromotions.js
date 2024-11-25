const express = require('express');
const Promotion = require('../models/Promotions');
const router = express.Router();

// Route to get all promotions
router.get('/promotions', async (req, res) => {
  try {
    const promotions = await Promotion.find();
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
    const savedPromotion = await newPromotion.save();
    res.status(201).json(savedPromotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to update an existing promotion
router.put('/promotions/:id', async (req, res) => {
  try {
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
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete a promotion
router.delete('/promotions/:id', async (req, res) => {
  try {
    const deletedPromotion = await Promotion.findByIdAndDelete(req.params.id);

    if (!deletedPromotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    res.status(200).json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
