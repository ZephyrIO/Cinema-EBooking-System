'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EditMovie.css';

const EditMovie = () => {
  const [movies, setMovies] = useState([]); // All movies
  const [editingMovieId, setEditingMovieId] = useState(null); // ID of the movie being edited
  const [editingMovie, setEditingMovie] = useState(null); // Movie being edited
  const [error, setError] = useState(null); // Error handling

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/movies'); // Fetch all movies
        setMovies(response.data);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movies.');
      }
    };
    fetchMovies();
  }, []);

  const handleEdit = (movie) => {
    console.log('Movie passed to handleEdit:', movie); // Log the movie object
    setEditingMovieId(movie._id || movie.id); // Set the ID of the movie being edited
    console.log('Editing Movie ID:', movie._id);
    const formattedMovie = {
      ...movie,
      showtimes: movie.showtimes.map((time) => convertTimeTo24HourFormat(time)),
    };
    setEditingMovie(formattedMovie);
  };
  

  const convertTimeTo24HourFormat = (time) => {
    // Convert "2:00 PM" -> "14:00"
    const [hours, minutes] = time.split(/[:\s]/);
    const isPM = time.toLowerCase().includes('pm');
    const hours24 = isPM ? (parseInt(hours) % 12) + 12 : parseInt(hours) % 12;
    return `${hours24.toString().padStart(2, '0')}:${minutes}`;
  };

  const convertTimeTo12HourFormat = (time) => {
    // Convert "14:00" -> "2:00 PM"
    const [hours, minutes] = time.split(':');
    const isPM = parseInt(hours) >= 12;
    const hours12 = isPM ? parseInt(hours) % 12 || 12 : parseInt(hours);
    return `${hours12}:${minutes} ${isPM ? 'PM' : 'AM'}`;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditingMovie({ ...editingMovie, [name]: value });
  };

  const handleArrayInputChange = (field, index, value) => {
    const updatedArray = [...editingMovie[field]];
    updatedArray[index] = value;
    setEditingMovie({ ...editingMovie, [field]: updatedArray });
  };

  const handleAddToArray = (field) => {
    setEditingMovie({ ...editingMovie, [field]: [...editingMovie[field], ''] });
  };

  const handleRemoveFromArray = (field, index) => {
    const updatedArray = [...editingMovie[field]];
    updatedArray.splice(index, 1);
    setEditingMovie({ ...editingMovie, [field]: updatedArray });
  };

  const handleSave = async (event) => {
    event.preventDefault();
  
    // Debugging: Log API endpoint and payload
    console.log('API Endpoint:', `/api/movies/${editingMovieId}`);
    console.log('Payload:', editingMovie);
  
    try {
      const response = await axios.put(`http://localhost:3001/api/movies/${editingMovieId}`, editingMovie);
      console.log('Response:', response.data); // Log successful response
      if (response.status === 200) {
        const updatedMovies = movies.map((movie) =>
          movie._id === editingMovieId ? response.data : movie
        );
        setMovies(updatedMovies);
        alert('Movie updated successfully!');
        setEditingMovieId(null);
        setEditingMovie(null); // Clear editing state
      }
    } catch (err) {
      console.error('Error updating movie:', err.response || err); // Log error
      if (err.response) {
        console.log('Response status:', err.response.status); // Log status code
        console.log('Response data:', err.response.data); // Log response data
      }
      setError(err.response?.data?.message || 'Failed to update movie.');
    }
  };
  
  

  const handleCancel = () => {
    setEditingMovieId(null);
    setEditingMovie(null); // Reset editing state
    setError(null);
  };

  if (error) return <div className="error-message">{error}</div>; // Show error message if any

  return (
    <div className="edit-movies-page">
      <h1 className="title">Edit Movies</h1>

      <div className="movie-list">
      {movies.map((movie) => (
      <div key={movie._id} className="movie-item">
      <div>
        <strong>{movie.title}</strong>
        <p>{movie.category}</p>
      </div>
      <button
        className="edit-button"
        onClick={() => handleEdit(movie)} // Ensure correct movie object is passed
      >
        Edit
      </button>
    </div>
  ))}
</div>

      {editingMovie && (
        <form className="edit-movie-form" onSubmit={handleSave}>
          <h2>Edit Movie: {editingMovie.title}</h2>

          <label>
            Title:
            <input
              type="text"
              name="title"
              value={editingMovie.title}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Category:
            <input
              type="text"
              name="category"
              value={editingMovie.category}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Cast:
            {editingMovie.cast.map((castMember, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={castMember}
                  onChange={(e) =>
                    handleArrayInputChange('cast', index, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFromArray('cast', index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddToArray('cast')}>
              Add Cast Member
            </button>
          </label>

          <label>
            Director:
            <input
              type="text"
              name="director"
              value={editingMovie.director}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Producer:
            <input
              type="text"
              name="producer"
              value={editingMovie.producer}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              value={editingMovie.description}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Trailer Link:
            <input
              type="text"
              name="trailerLink"
              value={editingMovie.trailerLink}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Release Date:
            <input
              type="date"
              name="releaseDate"
              value={editingMovie.releaseDate?.split('T')[0]} // Format for date input
              onChange={handleInputChange}
            />
          </label>

          <label>
            Rating:
            <input
              type="text"
              name="rating"
              value={editingMovie.rating}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Reviews:
            {editingMovie.reviews.map((review, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={review}
                  onChange={(e) =>
                    handleArrayInputChange('reviews', index, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFromArray('reviews', index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddToArray('reviews')}>
              Add Review
            </button>
          </label>

          <label>
            Show Dates:
            {editingMovie.showdates.map((showdate, index) => (
              <div key={index}>
                <input
                  type="date"
                  value={showdate.split('T')[0]} // Format for date input
                  onChange={(e) =>
                    handleArrayInputChange('showdates', index, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFromArray('showdates', index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddToArray('showdates')}>
              Add Show Date
            </button>
          </label>

          <label>
            Show Times:
            {editingMovie.showtimes.map((showtime, index) => (
              <div key={index}>
                <input
                  type="time"
                  value={showtime}
                  onChange={(e) =>
                    handleArrayInputChange('showtimes', index, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFromArray('showtimes', index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddToArray('showtimes')}>
              Add Show Time
            </button>
          </label>

          <div className="button-group">
            <button type="submit" className="save">
              Save Changes
            </button>
            <button
              type="button"
              className="cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditMovie;
