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
  const [filterRating, setFilterRating] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedUserDataString = localStorage.getItem('userData');
    if (storedUserDataString && storedUserDataString !== "undefined") {
      try {
        const storedUserData = JSON.parse(storedUserDataString);
        if (storedUserData && storedUserData.token) {
          setUserData(storedUserData);
          setIsToken(true)
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

    // Fetch all unique genres for dropdown
    const fetchGenres = async () => {
      try {
        const response = await axios.get('/api/genres'); // Backend endpoint for genres
        setGenres(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchMovies();
    fetchGenres();
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

  const handleGenreFilter = async (genre) => {
    try {
      if (!genre) {
        const response = await axios.get('/api/movies'); // Fetch all movies if genre is cleared
        setMovies(response.data);
      } else {
        const response = await axios.get(`/api/movies/filter/genre/${genre}`);
        setMovies(response.data);
      }
    } catch (error) {
      console.error('Error filtering movies by genre:', error);
    }
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
                setIsToken(false)
                router.push('/');
              }}>Logout</button>
            ) : (
              <button onClick={() => router.push('/login')}>Login</button>
            )}
            <button onClick={() => router.push('/register')}>Register</button>
            <button onClick={() => router.push('/EditProfile')} disabled={userData == undefined}>Edit Profile</button>
            {(isToken) ? (
              userData.user.isAdmin ? (
                <button onClick={() => {
                  router.push('/AdminMainScreen');
                }}>Administrator Panel</button>
              ) : (<></>)) : (<></>)}
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

          <h3>Filter By Genre:</h3>
          <select
            onChange={(e) => handleGenreFilter(e.target.value)}
            defaultValue=""
            className="genre-dropdown"
          >
            <option value="" disabled>
              Select a genre
            </option>
            {genres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
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
    </UserContext.Provider>
  );
};

export default HomePage;
