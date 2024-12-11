import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CheckOutForm.css';

const CheckOutForm = ({ movieDetails, userDetails, onConfirm, onCancel, userHasLinkedPayment, selectedSeats, seatCategories }) => {
  const [name, setName] = useState(userDetails.name); 
  const [email, setEmail] = useState(userDetails.email); 
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const ticketPrices = {
    adult: 15,
    child: 10,
  };
  const salesTax = 0.08; 
  const onlineFee = 2.5; 

  const validatePromoCode = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/validate-promo', { promoCode });
      setPromoDiscount(response.data.discount);
      setPromoMessage(response.data.message);
    } catch (error) {
      setPromoDiscount(0);
      setPromoMessage(error.response?.data?.message || 'Failed to validate promo code');
    }
  };

  // Calculate the total price before the discount
  const calculateTotalBeforeDiscount = () => {
    const ticketTotal = selectedSeats.reduce((sum, seat, index) => {
      const seatType = seatCategories[index];
      return sum + ticketPrices[seatType];
    }, 0);
    const totalBeforeTaxAndFees = ticketTotal;
    const totalAfterTax = totalBeforeTaxAndFees * (1 + salesTax);
    const totalWithFees = totalAfterTax + onlineFee;
    return parseFloat(totalWithFees.toFixed(3)); // Round to two decimal places
  };
  
  // Calculate the discounted total prices
  const calculateTotalAfterDiscount = () => {
    const totalBeforeDiscount = calculateTotalBeforeDiscount();
    const totalWithDiscount = totalBeforeDiscount * ((100 - promoDiscount) / 100);
    return parseFloat(totalWithDiscount.toFixed(3)); // Round to two decimal places
  };
  
  // Calculate the discount amount
  const calculateDiscountAmount = () => {
    const totalBeforeDiscount = calculateTotalBeforeDiscount();
    const discountAmount = totalBeforeDiscount - calculateTotalAfterDiscount();
    return parseFloat(discountAmount.toFixed(3)); // Round to two decimal places
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const paymentInfo = userHasLinkedPayment ? 'linked' : { cardNumber, expiryDate, cvv };
  
    const bookingDetails = {
      name,
      email,
      paymentInfo,
      tickets: selectedSeats.map((seat, index) => ({
        seatNumber: seat,
        seatType: seatCategories[index],
      })),
      totalAmount: calculateTotalAfterDiscount(),
      movie: movieDetails,
      promoCode,
    };
  
    try {
      // Submit the order
      const response = await axios.post('http://localhost:3001/api/submit-order', bookingDetails);
  
      if (response.status === 201) {
        alert(`Booking confirmed! Booking Number: ${response.data.bookingNumber}`);
        onConfirm(response.data); // Pass the booking details back to the parent component
      } else {
        alert('Booking was successful, but there was an issue with the confirmation email.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was an issue with your checkout. Please try again.');
    }
  };
  

  return (
    <div className="checkout-form">
      <h2>Check Out - {movieDetails.title}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Selected Seats:</label>
          <ul>
            {selectedSeats.map((seat, index) => (
              <li key={seat}>
                Seat {seat} - {seatCategories[index] === 'adult' ? 'Adult ($15)' : 'Child ($10)'}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label>Promo Code:</label>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button type="button" onClick={validatePromoCode}>Apply Promo</button>
          {promoMessage && <p>{promoMessage}</p>}
        </div>

        <h3>Original Total: ${calculateTotalBeforeDiscount()}</h3>
        {promoDiscount > 0 && <h3>Discount: -${calculateDiscountAmount()}</h3>}
        <h3>Total After Discount: ${calculateTotalAfterDiscount()}</h3>

        {!userHasLinkedPayment && (
          <>
            <div>
              <label>Card Number:</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Expiry Date:</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label>CVV:</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div>
          <button type="submit">Confirm Checkout</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CheckOutForm;
