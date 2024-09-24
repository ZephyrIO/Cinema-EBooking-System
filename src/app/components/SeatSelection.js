import React, { useState } from 'react';

const SeatSelection = ({ movie, showtime, onSeatsSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const seatLayout = Array(5).fill().map(() => Array(8).fill(false)); // Sample seat layout

  const handleSeatClick = (rowIndex, colIndex) => {
    const seatID = `${rowIndex}-${colIndex}`;
    if (selectedSeats.includes(seatID)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatID));
    } else {
      setSelectedSeats([...selectedSeats, seatID]);
    }
  };

  const handleProceed = () => {
    if (selectedSeats.length > 0) {
      onSeatsSelect(selectedSeats);
    } else {
      alert('Please select at least one seat.');
    }
  };

  return (
    <div>
      <h2>Select Seats for {movie} at {showtime}</h2>
      <div className="seat-chart">
        {seatLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            {row.map((_, colIndex) => {
              const seatID = `${rowIndex}-${colIndex}`;
              return (
                <button
                  key={seatID}
                  className={selectedSeats.includes(seatID) ? 'seat selected' : 'seat'}
                  onClick={() => handleSeatClick(rowIndex, colIndex)}
                >
                  {seatID}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <button onClick={handleProceed}>Proceed to Seat Category</button>
    </div>
  );
};

export default SeatSelection;
