import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './MovieSelection.css';

const MovieSelection = ({ onMovieSelect }) => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [movieDates, setMovieDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/movies'); // This will be proxied to the backend
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

  const handleMovieChange = (e) => {
    const movie = movies.find((m) => m.title === e.target.value);
    setSelectedMovie(movie);
    setShowtimes(movie ? movie.showtimes : []);
    setMovieDates(movie ? movie.showdates : []); // Assuming dates are part of the movie object
    setSelectedShowtime('');
    setSelectedDate('');
  };

  const handleMovieDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleProceed = () => {
    if (selectedMovie && selectedShowtime && selectedDate) {
      onMovieSelect(selectedMovie.title, selectedShowtime, selectedDate);
    } else {
      alert('Please select a movie, showtime, and date.');
    }
  };

  return (
    <div className="container">
      <h2>Select Movie, Date, and Showtime</h2>
      <div>
        <label>Movie:</label>
        <select value={selectedMovie.title || ''} onChange={handleMovieChange}>
          <option value="">Select Movie</option>
          {movies.map((movie) => (
            <option key={movie._id} value={movie.title}>
              {movie.title}
            </option>
          ))}
        </select>
      </div>

      {selectedMovie && (
        <div>
          <label>Date:</label>
          <select
            value={selectedDate}
            onChange={handleMovieDateChange}
          >
            <option value="">Select Date</option>
            {movieDates.map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedMovie && selectedDate && (
        <div>
          <label>Showtime:</label>
          <select
            value={selectedShowtime}
            onChange={(e) => setSelectedShowtime(e.target.value)}
            disabled={!selectedDate}
          >
            <option value="">Select Showtime</option>
            {showtimes.map((showtime, index) => (
              <option key={index} value={showtime}>
                {showtime}
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={handleProceed}>Proceed to Seat Selection</button>
    </div>
  );
};

export default MovieSelection;
