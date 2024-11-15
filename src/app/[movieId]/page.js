'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import './moviePage.css';

const MovieDetailsPage = ({ params }) => {
  const { movieId } = params;
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

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

  const handleGoHome = () => {
    router.push('/'); // Navigate to home page
  };

  if (error) return <div>{error}</div>;

  return (
    movie ? (
      <div className="movie-details">
        <button onClick={handleGoHome} className="back-to-home">Back to Home</button> {/* Back to Home Button */}
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
        {console.log(localStorage.getItem('userData'))}
        <button onClick={() => router.push('/movie-selection')} disabled={localStorage.getItem('userData') == 'undefined' || localStorage.getItem('userData') == null}>Book Movie</button>
      </div>
    ) : (
      <p>Loading...</p>
    )
  );
};

export default MovieDetailsPage;
