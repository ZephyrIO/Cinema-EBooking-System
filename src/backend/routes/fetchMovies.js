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
// Route to filter movies by rating
router.get('/movies/filter/rating/:rating', async (req, res) => {
  try {
    const movies = await Movie.find({ rating: req.params.rating });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to filter movies by rating' });
  }
});

// Route to filter movies by a specific date
router.get('/movies/filter/date/:date', async (req, res) => {
  try {
    const movies = await Movie.find({ showdates: { $eq: new Date(req.params.date) } });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to filter movies by date' });
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

// Route to update an existing movie
router.put('/movies/:id', async (req, res) => {
  try {
    const { showdates, showtimes } = req.body;

    // Find all movies except the one being updated
    const conflictingMovies = await Movie.find({
      _id: { $ne: req.params.id }, // Exclude the current movie
      showdates: { $in: showdates }, // Check overlapping showdates
      showtimes: { $in: showtimes }, // Check overlapping showtimes
    });

    if (conflictingMovies.length > 0) {
      return res.status(400).json({
        message: 'Show date and time conflicts with other movies.',
        conflicts: conflictingMovies.map((movie) => ({
          title: movie.title,
          showdates: movie.showdates,
          showtimes: movie.showtimes,
        })),
      });
    }

    // Proceed with updating the movie
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
