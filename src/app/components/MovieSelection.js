import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './MovieSelection.css';
const MovieSelection = ({ onMovieSelect }) => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState('');

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
    setSelectedShowtime('');
  };

  const handleProceed = () => {
    if (selectedMovie && selectedShowtime) {
      onMovieSelect(selectedMovie.title, selectedShowtime);
    } else {
      alert('Please select both a movie and a showtime.');
    }
  };

  return (
    <div className="container">
      <h2>Select Movie and Showtime</h2>
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
      <div>
        <label>Showtime:</label>
        <select
          value={selectedShowtime}
          onChange={(e) => setSelectedShowtime(e.target.value)}
          disabled={!selectedMovie}
        >
          <option value="">Select Showtime</option>
          {showtimes.map((showtime, index) => (
            <option key={index} value={showtime}>
              {showtime}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleProceed}>Proceed to Seat Selection</button>
    </div>
  );
  
};

export default MovieSelection;
