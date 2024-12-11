const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  seatType: { type: String, required: true }, // Rename `seatType` to `type` if required
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  tickets: { type: [ticketSchema], required: true },
  totalAmount: { type: Number, required: true },
  movie: { type: Object, required: true },
  promoCode: { type: String },
});

module.exports = mongoose.model('Order', orderSchema);
