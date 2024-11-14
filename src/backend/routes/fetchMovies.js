const express = require('express');
const Movie = require('../models/Movies'); // Import the Movie model
const router = express.Router();

// Route to get all movies
router.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find(); // Fetch all movies using Mongoose
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Route to get a single movie by ID
router.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route to add a new movie
router.post('/movies', async (req, res) => {
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
    const savedMovie = await newMovie.save(); // Save the movie to the database
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
