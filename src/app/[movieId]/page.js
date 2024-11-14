'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const MovieDetailsPage = ({ params }) => {
  const { movieId } = params;
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`/api/movies/${movieId}`);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Failed to load movie details.');
      }
    };
    fetchMovie();
  }, [movieId]);

  if (error) return <div>{error}</div>;

  return (
    movie ? (
      <div className="movie-details">
        <h1>{movie.title}</h1>
        <p><strong>Category:</strong> {movie.category}</p>
        <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
        <p><strong>Director:</strong> {movie.director}</p>
        <p><strong>Producer:</strong> {movie.producer}</p>
        <p><strong>Description:</strong> {movie.description}</p>
        <p><strong>Rating:</strong> {movie.rating}</p>
        <p><strong>Reviews:</strong> {movie.reviews.join(', ')}</p>
        <p><strong>Show Dates:</strong> {movie.showdates.join(', ')}</p>
        <p><strong>Showtimes:</strong> {movie.showtimes.join(', ')}</p>
        <div>
          <iframe
            width="560"
            height="315"
            src={movie.trailerLink}
            title="Movie Trailer"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    ) : (
      <p>Loading...</p>
    )
  );
};

export default MovieDetailsPage;
