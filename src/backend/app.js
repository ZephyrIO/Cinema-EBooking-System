const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const moviesRouter = require('./routes/fetchMovies');
const registerRouter = require('./routes/register'); // Import the register API route
const loginRouter = require('./routes/login');

const app = express();

// Enable CORS for requests from port 3000 (frontend)
app.use(cors({
  origin: 'http://localhost:3000',
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
