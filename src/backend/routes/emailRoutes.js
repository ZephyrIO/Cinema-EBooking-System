const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// POST route to send email
router.post('/sendEmail', async (req, res) => {
  const { email, promotions } = req.body;

  if (!email || !promotions) {
    return res.status(400).json({ message: 'Email and promotions are required.' });
  }

  try {
    // Configure your email transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || '4050testemail@gmail.com',
            pass: process.env.EMAIL_PASS || 'fibv rdkr jxnh ukyc',
        },
    });

    // Format the promotions into an HTML email
    const promotionDetails = promotions.map(
      (promotion) => `
        <div>
          <h3>${promotion.title}</h3>
          <p>${promotion.description}</p>
          <p><strong>Code:</strong> ${promotion.code}</p>
          <p><strong>Discount:</strong> ${promotion.discount}%</p>
        </div>
        <hr />
      `
    ).join('');

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Latest Promotions',
        html: `
          <h2>Check Out Our Latest Promotions!</h2>
          ${promotionDetails}
        `,
      };


    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

module.exports = router;
