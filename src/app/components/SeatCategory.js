import React, { useState } from 'react';

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
    <div>
      <h2>Select Seat Categories</h2>
      {selectedSeats.map((seat, index) => (
        <div key={seat}>
          <label>{seat}</label>
          <select
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
