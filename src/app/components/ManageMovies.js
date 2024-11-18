'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // For routing in Next.js
import axios from 'axios';
import MovieCard from './MovieCard';
import './ManageMovies.css';
import { useContext } from 'react';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    title: '',
    category: '',
    cast: [],
    director: '',
    producer: '',
    description: '',
    trailerLink: '',
    releaseDate: '',
    rating: '',
    reviews: [],
    showdates: [],
    showtimes: [],
  });
  const [showAddMovieForm, setShowAddMovieForm] = useState(false);
  const [error, setError] = useState(null); // For displaying errors
  const router = useRouter(); // For navigation

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

  const validateRequiredFields = () => {
    const requiredFields = ['title', 'category', 'director', 'producer', 'description', 'releaseDate', 'rating'];
    for (const field of requiredFields) {
      if (!newMovie[field]) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
        return false;
      }
    }
    if (!newMovie.cast.length) {
      setError('At least one cast member is required.');
      return false;
    }
    if (!newMovie.reviews.length) {
      setError('At least one review is required.');
      return false;
    }
    return true;
  };

  const handleAddMovie = async (event) => {
    event.preventDefault();

    if (!validateRequiredFields()) return;

    try {
      const response = await axios.post('/api/movies', newMovie);
      if (response.status === 201) {
        setMovies([...movies, response.data]);
        alert('Movie added successfully!');
        setNewMovie({
          title: '',
          category: '',
          cast: [],
          director: '',
          producer: '',
          description: '',
          trailerLink: '',
          releaseDate: '',
          rating: '',
          reviews: [],
          showdates: [],
          showtimes: [],
        });
        setError(null);
        setShowAddMovieForm(false);
      }
    } catch (error) {
      console.error('Error adding movie:', error.response || error);
      setError(error.response?.data?.message || 'Failed to add movie.');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewMovie({ ...newMovie, [name]: value });
  };


  return (
    <div className="adminMainScreen">
      <h1 className="title">Manage Movies</h1>

      {error && <div className="error-message">{error}</div>} {/* Error message */}

      <div>
        {movies.map((movie) => (
          <div key={movie.id || movie._id} className="movie-card-container">
            <MovieCard movie={movie} />            
          </div>
        ))}
      </div>

      <button className="edit-button" onClick={() => router.push('/EditMovie')}>
              Edit Movie
      </button>

      <button onClick={() => setShowAddMovieForm(!showAddMovieForm)}>
        {showAddMovieForm ? 'Cancel Add Movie' : 'Add Movie'}
      </button>

      {showAddMovieForm && (
        <form onSubmit={handleAddMovie}>
          <h2>Add New Movie</h2>

          <label>
            Title:
            <input type="text" name="title" value={newMovie.title} onChange={handleInputChange} />
          </label>

          <label>
            Category:
            <input type="text" name="category" value={newMovie.category} onChange={handleInputChange} />
          </label>

          <label>
            Cast:
            {newMovie.cast.map((castMember, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={castMember}
                  onChange={(event) =>
                    setNewMovie({
                      ...newMovie,
                      cast: newMovie.cast.map((item, i) =>
                        i === index ? event.target.value : item
                      ),
                    })
                  }
                />
                <button type="button" onClick={() => setNewMovie({ ...newMovie, cast: newMovie.cast.filter((_, i) => i !== index) })}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setNewMovie({ ...newMovie, cast: [...newMovie.cast, ''] })}>
              Add Cast Member
            </button>
          </label>

          <label>
            Director:
            <input type="text" name="director" value={newMovie.director} onChange={handleInputChange} />
          </label>

          <label>
            Producer:
            <input type="text" name="producer" value={newMovie.producer} onChange={handleInputChange} />
          </label>

          <label>
            Description:
            <textarea name="description" value={newMovie.description} onChange={handleInputChange} />
          </label>

          <label>
            Trailer Link:
            <input type="text" name="trailerLink" value={newMovie.trailerLink} onChange={handleInputChange} />
          </label>

          <label>
            Release Date:
            <input type="date" name="releaseDate" value={newMovie.releaseDate} onChange={handleInputChange} />
          </label>

          <label>
            Rating:
            <input type="text" name="rating" value={newMovie.rating} onChange={handleInputChange} />
          </label>

          <div className="button-group">
            <button type="submit" className="save">
              Save Movie
            </button>
            <button type="button" className="cancel" onClick={() => setShowAddMovieForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ManageMovies;
