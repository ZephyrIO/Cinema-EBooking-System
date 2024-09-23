const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Currently Running', 'Coming Soon'], required: true },
  cast: { type: [String], required: true },  // An array of cast members
  director: { type: String, required: true },
  producer: { type: String, required: true },
  description: { type: String, required: true },
  trailerLink: { type: String, required: true },  // Link to the YouTube trailer
  releaseDate: { type: Date, required: true },
  rating: { type: String, enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'], required: true },
  reviews: { type: [String] },  // rotten tomatoes score
  showdates: { type: [Date], required: true },  // An array of show dates
  showtimes: { type: [String], required: true }  // An array of showtimes (strings)
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;