'use client';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import axios from 'axios';
import MovieCard from '@/app/components/MovieCard';
import UserContext from './components/UserContext';
import { useRouter } from 'next/navigation';
import './homepage.css';

const HomePage = () => {
  const [userData, setUserData] = useState(undefined);
  const [isToken, setIsToken] = useState(false);
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUserDataString = localStorage.getItem('userData');
    if (storedUserDataString && storedUserDataString !== "undefined") {
      try {
        const storedUserData = JSON.parse(storedUserDataString);
        if (storedUserData && storedUserData.token) {
          setUserData(storedUserData);
          setIsToken(true);
        }
      } catch (error) {
        console.error("Error parsing stored user data", error);
      }
    }
  }, []);

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
    <UserContext.Provider value={{ userData, setUserData }}>
      <div className="home-page">
        <header>
          <h1>Cinema E-Booking System</h1>
          <div className="auth-buttons">
            <button onClick={() => router.push('/movie-selection')} disabled={userData == undefined}>Book Movie</button>
            {isToken ? (
              <button onClick={() => {
                localStorage.removeItem('userData');
                setUserData(null);
                router.push('/');
              }}>Logout</button>
            ) : (
              <button onClick={() => router.push('/login')}>Login</button>
            )}
            <button onClick={() => router.push('/register')}>Register</button>
            <button onClick={() => router.push('/EditProfile')} disabled={userData == undefined}>Edit Profile</button>
          </div>
        </header>

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
            {currentlyRunning.length > 0 ? (
              currentlyRunning.map(movie => (
                <MovieCard key={movie._id} movie={movie} />
              ))
            ) : (
              <p>No movies found for "{searchTerm}" in Currently Running.</p>
            )}
          </div>
        </section>

        <section className="movie-section">
          <h2>Coming Soon</h2>
          <div className="movie-list">
            {comingSoon.length > 0 ? (
              comingSoon.map(movie => (
                <MovieCard key={movie._id} movie={movie} />
              ))
            ) : (
              <p>No movies found for "{searchTerm}" in Coming Soon.</p>
            )}
          </div>
        </section>
      </div>
    </UserContext.Provider>
  );
};

export default HomePage;
