const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

console.log('JWT_SECRET:', process.env.JWT_SECRET);

// POST route for user registration
router.post('/register', async (req, res) => {
    const { email, password, name, phone, cardType, cardNumber, expirationDate, street, city, state, zip } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedCardNumber = await bcrypt.hash(cardNumber, 10);
        const hashedExpirationDate = await bcrypt.hash(expirationDate, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            phone,
            cardType,
            cardNumber: hashedCardNumber,
            expirationDate: hashedExpirationDate,
            address: { street, city, state, zip },
            status: 'inactive',
            isAdmin: false,
        });
        const jwtSecret = process.env.JWT_SECRET || 'fallbackSecret';
        // Save the user to the database
        const savedUser = await newUser.save();
        console.log('User saved:', savedUser);

        require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

        console.log('Environment variables loaded:');
        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        console.log('EMAIL_USER:', process.env.EMAIL_USER);   
        const verificationToken = jwt.sign({ userId: savedUser._id }, jwtSecret, { expiresIn: '1d' });
        console.log('Generated verification token:', verificationToken);
        
        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        console.log('EMAIL_USER:', process.env.EMAIL_USER);

        
        // Send confirmation email
        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Respond with a warning but not fail registration due to email issue
            return res.status(201).json({ 
                message: 'User registered successfully, but confirmation email failed to send', 
                userId: savedUser._id 
            });
        }

        // Respond with success if everything goes well
        return res.status(201).json({ message: 'User registered successfully', userId: savedUser._id });
    } catch (error) {
        // If something went wrong, return an error
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Error registering user', error });
    }
});


  // Function to send the verification email
async function sendVerificationEmail(email, token) {
  const verificationLink = `http://localhost:3000/verify/${token}`;
  console.log('Sending verification email to:', email, 'with link:', verificationLink);
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.EMAIL_USER || '4050testemail@gmail.com',
          pass: process.env.EMAIL_PASS || 'fibv rdkr jxnh ukyc',
      },
      logger: true, // Enable detailed logging
      debug: true,  // Include SMTP traffic in the logs
  });

  const mailOptions = {
      from: '4050testemail@gmail.com',
      to: email,
      subject: 'Verify Your Account',
      html: `<p>Thank you for registering. Please verify your email by clicking the link below:</p>
             <a href="${verificationLink}">Verify Email</a>`,
  };


  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully.');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}



router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;


  try {
      console.log('Verifying token:', token);
      const jwtSecret = process.env.JWT_SECRET || 'fallbackSecret';
      console.log('JWT Secret Used:', jwtSecret);

      const decoded = jwt.verify(token, jwtSecret);
      console.log('Decoded Token:', decoded);

      const user = await User.findById(decoded.userId);
      console.log('User Found:', user);
      console.log('Token Expiry:', new Date(decoded.exp * 1000));
      console.log('Token Issued At:', new Date(decoded.iat * 1000));


      if (!user) {
          return res.status(400).json({ message: 'Invalid verification link.' });
      }

      if (user.status === 'active') {
        return res.status(200).json({ message: 'Your account has been verified!' });
    }

      user.status = 'active';
      await user.save();
      console.log('User status updated to active.');
      res.status(200).json({ message: 'Your account has been verified!' });
  } catch (error) {
      console.error('Verification Error:', error);
      res.status(400).json({ message: 'Invalid or expired verification link.' });
  }
});


module.exports = router; 