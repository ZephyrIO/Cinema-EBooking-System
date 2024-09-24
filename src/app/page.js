'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '@/app/components/MovieCard';

import './homepage.css';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentlyRunning = filteredMovies.filter(movie => movie.category === 'Currently Running');
  const comingSoon = filteredMovies.filter(movie => movie.category === 'Coming Soon');

  return (
    <div className="home-page">
      <header>
        <h1>Cinema E-Booking System</h1>
        <div className="auth-buttons">
          <button onClick={() => window.location.href = '/register'}>Book Movie</button>
          <button onClick={() => window.location.href = '/login'}>Login</button>
          <button onClick={() => window.location.href = '/register'}>Register</button>
        </div>
      </header>

      {/* Search container */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <section className="movie-section">
        <h2>Currently Running</h2>
        <div className="movie-list">
          {currentlyRunning.map(movie => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="movie-section">
        <h2>Coming Soon</h2>
        <div className="movie-list">
          {comingSoon.map(movie => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
