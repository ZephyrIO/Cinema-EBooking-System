const express = require('express');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid'); // Generate unique booking number
const Order = require('../models/Order'); // Import the Order model

const router = express.Router();

// Submit order route
router.post('/submit-order', async (req, res) => {
  const { name, email, paymentInfo, tickets, totalAmount, movie, promoCode } = req.body;

  console.log('Received order data:', req.body); // Log the request body

  if (!name || !email || !Array.isArray(tickets) || tickets.length === 0 || !movie || !totalAmount) {
    console.error('Validation failed: Missing required fields');
    return res.status(400).json({ message: 'Validation failed: Missing required fields' });
  }

  const bookingNumber = uuidv4();

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
    console.log('Saving order to database...');
    const savedOrder = await newOrder.save();
    console.log('Order saved:', savedOrder);

    // Send confirmation email
    console.log('Sending confirmation email...');
    await sendConfirmationEmail(email, savedOrder);
    console.log('Confirmation email sent successfully');

    res.status(201).json({ bookingNumber, ...savedOrder._doc });
  } catch (error) {
    console.error('Error processing order:', error.stack); // Log the error stack
    res.status(500).json({ message: 'Error processing order', error: error.message });
  }
});

// Email confirmation logic
const sendConfirmationEmail = async(toEmail, orderDetails) => {
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
    html: `
      <h2>Booking Confirmation</h2>
      <p>Hi ${orderDetails.name},</p>
      <p>Thank you for your booking! Here are your booking details:</p>
      <ul>
        <li><strong>Booking Number:</strong> ${orderDetails.bookingNumber}</li>
        <li><strong>Movie:</strong> ${orderDetails.movie.title}</li>
        <li><strong>Total Amount Paid:</strong> $${orderDetails.totalAmount}</li>
        <li><strong>Seats:</strong> ${orderDetails.tickets.map(ticket => ticket.seatNumber).join(', ')}</li>
      </ul>
      <p>We look forward to seeing you at the cinema!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

module.exports = router;
