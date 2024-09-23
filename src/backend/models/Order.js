const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  tickets: [
    {
      type: { type: String, enum: ['adult', 'child'], required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  movie: {
    title: { type: String, required: true },
  },
  promoCode: { type: String },
  promoDiscount: { type: Number },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
