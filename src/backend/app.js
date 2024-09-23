const express = require('express');
const mongoose = require('mongoose');
const Movie = require('./models/Movies');  // Import the Movie model

const app = express();

const uri = "mongodb+srv://kp45110:123@cinemaebooking.fujzi.mongodb.net/cinema_ebooking?retryWrites=true&w=majority&appName=CinemaEBooking";

// Connect to the MongoDB database with Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB via Mongoose'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use(express.json());

// Route to get all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();  // Fetch all movies using Mongoose
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a new movie
app.post('/movies', async (req, res) => {
  const newMovie = new Movie({
    title: req.body.title,
    category: req.body.category,
    cast: req.body.cast,
    director: req.body.director,
    producer: req.body.producer,
    description: req.body.description,
    trailerLink: req.body.trailerLink,
    releaseDate: req.body.releaseDate,
    rating: req.body.rating,
    reviews: req.body.reviews,
    showdates: req.body.showdates,
    showtimes: req.body.showtimes
  });

  try {
    const savedMovie = await newMovie.save();  // Save the movie to the database using Mongoose
    res.status(201).json(savedMovie);  // Return the saved movie
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start the server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
