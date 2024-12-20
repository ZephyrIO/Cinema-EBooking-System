const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  cardType: { type: String },
  cardNumber: { type: String },
  expirationDate: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
  },
  status: { type: String, default: 'inactive' },
  isAdmin: { type: Boolean, default: false },
  recievePromotions: { type: Boolean, default: false },
  resetPasswordToken: { type: String },  
  resetPasswordExpires: { type: Date },   
  createdAt: { type: Date, default: Date.now },
  suspended: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
