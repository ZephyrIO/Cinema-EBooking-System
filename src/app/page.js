'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MovieCard from '@/app/components/MovieCard';
import UserContext from './components/UserContext';
import './homepage.css';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/movies');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRatingFilter = async (rating) => {
    try {
      const response = await axios.get(`/api/movies/filter/rating/${rating}`);
      setMovies(response.data);
    } catch (error) {
      console.error('Error filtering movies by rating:', error);
    }
  };

  const handleDateFilter = async (date) => {
    try {
      if (!date) {
        // If date is cleared, fetch all movies
        const response = await axios.get('/api/movies');
        setMovies(response.data);
      } else {
        // Otherwise, filter by the specified date
        const response = await axios.get(`/api/movies/filter/date/${date}`);
        setMovies(response.data);
      }
    } catch (error) {
      console.error('Error filtering movies by date:', error);
    }
  };
  

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-page">
      <header>
        <h1>Cinema E-Booking System</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </header>

      <div className="filter-buttons">
        <h3>Filter By Rating:</h3>
          <select
            onChange={(e) => handleRatingFilter(e.target.value)}
            defaultValue=""
            className="rating-dropdown"
          >
            <option value="" disabled>Select a rating</option>
            <option value="G">G</option>
            <option value="PG">PG</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R</option>
            <option value="NC-17">NC-17</option>
          </select>


        <h3>Filter By Date:</h3>
        <input
            type="date"
            onChange={(e) => handleDateFilter(e.target.value)}
            onBlur={(e) => {
              if (!e.target.value) handleDateFilter('');
            }}
          />

      </div>

      <section className="movie-section">
        <h2>Movies</h2>
        <div className="movie-list">
          {filteredMovies.length > 0 ? (
            filteredMovies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))
          ) : (
            <p>No movies found for the current filters.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
