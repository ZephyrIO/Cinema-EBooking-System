'use client';
import React, { useState } from 'react';
import MovieSelection from '../components/MovieSelection';
import SeatSelection from '../components/SeatSelection';
import SeatCategory from '../components/SeatCategory';
import { useRouter } from 'next/navigation';
import styles from './MovieSelectionPage.css';
const MovieSelectionPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: MovieSelection, 2: SeatSelection, 3: SeatCategory
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatCategories, setSeatCategories] = useState([]);

  // Step 1: Movie and Showtime Selection
  const handleMovieSelection = (movie, showtime) => {
    setSelectedMovie(movie);
    setSelectedShowtime(showtime);
    setStep(2); // Move to SeatSelection
  };

  // Step 2: Seat Selection
  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
    setStep(3); // Move to SeatCategory Selection
  };

  // Step 3: Seat Category Selection
  const handleSeatCategorySelection = (categories) => {
    // Manually construct the URL with query parameters
    const query = new URLSearchParams({
      movie: selectedMovie,
      showtime: selectedShowtime,
      seats: selectedSeats.join(','), 
      categories: categories.join(','), 
    });
  
    // Proceed to Checkout Page with selected data
    router.push(`/checkout?${query.toString()}`);
  };

  return (
    <div>
      {step === 1 && (
        <MovieSelection onMovieSelect={handleMovieSelection} />
      )}
      {step === 2 && (
        <SeatSelection movie={selectedMovie} showtime={selectedShowtime} onSeatsSelect={handleSeatSelection} />
      )}
      {step === 3 && (
        <SeatCategory selectedSeats={selectedSeats} onCategorySelect={handleSeatCategorySelection} />
      )}
    </div>
  );
};

export default MovieSelectionPage;
