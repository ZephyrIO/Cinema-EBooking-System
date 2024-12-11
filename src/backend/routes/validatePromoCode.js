const express = require('express');
const Promotion = require('../models/Promotions');
const router = express.Router();

router.post('/validate-promo', async (req, res) => {
  const { promoCode } = req.body;

  try {
    const promotion = await Promotion.findOne({ code: promoCode });

    if (!promotion) {
      return res.status(404).json({ message: 'Invalid promo code' });
    }

    res.status(200).json({ discount: promotion.discount, message: 'Promo code applied successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error validating promo code' });
  }
});

module.exports = router;
