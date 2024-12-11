const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const moviesRouter = require('./routes/fetchMovies');
const registerRouter = require('./routes/register'); // Import the register API route
const loginRouter = require('./routes/login');
const userRouter = require('./routes/fetchUsers');
const promotionRouter = require('./routes/fetchPromotions');
const emailRoutes = require('./routes/emailRoutes');
const orderRouter = require('./routes/fetchOrders');
const app = express();

// Enable CORS for requests from port 3000 (frontend)
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary methods
  credentials: true, // Include credentials if needed
}));

app.use(express.json());

const uri = "mongodb+srv://kp45110:123@cinemaebooking.fujzi.mongodb.net/cinema_ebooking?retryWrites=true&w=majority&appName=CinemaEBooking";

// Connect to MongoDB with Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB via Mongoose'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Use the routes
app.use('/api', moviesRouter);
app.use('/api', registerRouter);  // Add register router
app.use('/api', loginRouter);
app.use('/api', userRouter);
app.use('/api', promotionRouter);
app.use('/api', emailRoutes);
app.use('/api', orderRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
