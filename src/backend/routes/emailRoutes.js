const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Assuming a User model exists
const router = express.Router();

// POST route to send email to all subscribed users
router.post('/sendEmailToSubscribed', async (req, res) => {
  const { promotions } = req.body;

  if (!promotions || promotions.length === 0) {
    return res.status(400).json({ message: 'Promotions are required.' });
  }

  try {
    // Fetch users who opted to receive promotions
    const subscribedUsers = await User.find({ recievePromotions: true });

    if (subscribedUsers.length === 0) {
      return res.status(404).json({ message: 'No subscribed users found.' });
    }

    // Collect email addresses of subscribed users
    const emailAddresses = subscribedUsers.map(user => user.email);

    // Format promotions into an HTML structure
    const promotionDetails = promotions
      .map(
        promotion => `
        <div>
          <h3>${promotion.title}</h3>
          <p>${promotion.description}</p>
          <p><strong>Code:</strong> ${promotion.code}</p>
          <p><strong>Discount:</strong> ${promotion.discount}%</p>
        </div>
        <hr />
      `
      )
      .join('');

    // Configure your email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || '4050testemail@gmail.com',
        pass: process.env.EMAIL_PASS || 'fibv rdkr jxnh ukyc',
      },
    });

    // Send email to all subscribed users
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailAddresses, // Array of email addresses
      subject: 'Latest Promotions',
      html: `
        <h2>Check Out Our Latest Promotions!</h2>
        ${promotionDetails}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: `Promotions sent to ${subscribedUsers.length} users.` });
  } catch (error) {
    console.error('Error sending email to subscribed users:', error);
    res.status(500).json({ message: 'Failed to send email to subscribed users.' });
  }
});

module.exports = router;
