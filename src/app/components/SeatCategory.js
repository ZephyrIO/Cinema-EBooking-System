import React, { useState } from 'react';
import styles from './SeatCategory.css';
const SeatCategory = ({ selectedSeats, onCategorySelect }) => {
  const [seatCategories, setSeatCategories] = useState(
    selectedSeats.map(() => 'adult') // Default all seats to "adult"
  );

  const handleCategoryChange = (index, category) => {
    const newCategories = [...seatCategories];
    newCategories[index] = category;
    setSeatCategories(newCategories);
  };

  const handleProceed = () => {
    onCategorySelect(seatCategories);
  };

  return (
    <div className="container">
      <h2>Select Seat Categories</h2>
      {selectedSeats.map((seat, index) => (
        <div key={seat} className="seat-row">
          <label>Seat {seat}:</label>
          <select
            className="select-category"
            value={seatCategories[index]}
            onChange={(e) => handleCategoryChange(index, e.target.value)}
          >
            <option value="adult">Adult</option>
            <option value="child">Child</option>
          </select>
        </div>
      ))}
      <button onClick={handleProceed}>Proceed to Checkout</button>
    </div>
  );
  
};

export default SeatCategory;
