const express = require('express');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid'); // Generate unique booking number
const Order = require('../models/Order'); // Import the Order model

const router = express.Router();

// Submit order route
router.post('/submit-order', async (req, res) => {
  const { name, email, paymentInfo, tickets, totalAmount, movie, promoCode } = req.body;

  // Generate a unique booking number
  const bookingNumber = uuidv4();

  // Create a new order object
  const newOrder = new Order({
    bookingNumber,
    name,
    email,
    tickets,
    totalAmount,
    movie,
    promoCode,
  });

  try {
    // Save the order in MongoDB
    const savedOrder = await newOrder.save();

    // Send confirmation email
    sendConfirmationEmail(email, savedOrder);

    // Return the saved order details and booking number to the frontend
    res.status(201).json({ bookingNumber, ...savedOrder._doc });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Error saving order' });
  }
});

// Email confirmation logic
const sendConfirmationEmail = (toEmail, orderDetails) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || '4050testemail@gmail.com',
      pass: process.env.EMAIL_PASS || 'fibv rdkr jxnh ukyc',
    },
  });

  const mailOptions = {
    from: '4050testemail@gmail.com',
    to: toEmail,
    subject: `Booking Confirmation - ${orderDetails.movie.title}`,
    text: `
      Hi ${orderDetails.name},
      Your booking for the movie "${orderDetails.movie.title}" has been confirmed.
      Booking Number: ${orderDetails.bookingNumber}
      Number of Tickets: ${orderDetails.tickets.map(ticket => `${ticket.quantity} ${ticket.type} ticket(s)`).join(', ')}
      Total Amount Paid: $${orderDetails.totalAmount}
      Thank you for booking with us!
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = router;
