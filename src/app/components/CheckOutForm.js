import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CheckOutForm.css';

const CheckOutForm = ({ movieDetails, userDetails, onConfirm, onCancel, userHasLinkedPayment, selectedSeats, seatCategories }) => {
  const [name, setName] = useState(userDetails?.name || ''); 
  const [email, setEmail] = useState(userDetails?.email || ''); 
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleGoHome = () => {
    window.location.href = '/'; // Navigate to home page
  };

  useEffect(() => {
    const token = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).token : null;

    if (token) {
      axios.get('http://localhost:3001/api/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      .then(response => {
        const userData = response.data;

        if (userData) {
          setName(userData.name || '');
          setEmail(userData.email || '');
          if (userData.paymentCards && userData.paymentCards.length > 0) {
            const defaultCard = userData.paymentCards[0];
            setCardNumber(defaultCard.cardNumber || '');
            setExpiryDate(defaultCard.expirationDate || '');
            setCvv(defaultCard.cvv || '');
          }
        }
      })
      .catch(error => {
        console.error('Failed to fetch user data:', error);
      });
    }
  }, []);

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

  const calculateTotalBeforeDiscount = () => {
    const ticketPrices = { adult: 15, child: 10 };
    const salesTax = 0.08; 
    const onlineFee = 2.5;

    const ticketTotal = selectedSeats.reduce((sum, seat, index) => {
      const seatType = seatCategories[index];
      return sum + ticketPrices[seatType];
    }, 0);

    const totalAfterTax = ticketTotal * (1 + salesTax);
    return parseFloat((totalAfterTax + onlineFee).toFixed(2));
  };

  const calculateTotalAfterDiscount = () => {
    return parseFloat((calculateTotalBeforeDiscount() * ((100 - promoDiscount) / 100)).toFixed(2));
  };

  const calculateDiscountAmount = () => {
    return parseFloat((calculateTotalBeforeDiscount() - calculateTotalAfterDiscount()).toFixed(2));
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
      const response = await axios.post('http://localhost:3001/api/submit-order', bookingDetails);

      if (response.status === 201) {
        alert(`Booking confirmed! Booking Number: ${response.data.bookingNumber}`);
        onConfirm(response.data);
      } else {
        alert('Booking was successful, but there was an issue with the confirmation email.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was an issue with your checkout. Please try again.');
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel the checkout?")) {
      onCancel();
    }
  };

  return (
    <div className="checkout-form">
      <h2>Check Out - {movieDetails.title}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Promo Code:</label>
          <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
          <button type="button" onClick={validatePromoCode}>Apply Promo</button>
          {promoMessage && <p>{promoMessage}</p>}
        </div>
        <h3>Total After Discount: ${calculateTotalAfterDiscount()}</h3>
        {!userHasLinkedPayment && (
          <>
            <div>
              <label>Card Number:</label>
              <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
            </div>
            <div>
              <label>Expiry Date:</label>
              <input type="text" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
            </div>
            <div>
              <label>CVV:</label>
              <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
            </div>
          </>
        )}
        <button type="submit">Confirm Checkout</button>
        <button type="button" className="cancel" onClick={handleGoHome}>Cancel</button>
      </form>
    </div>
  );
};

export default CheckOutForm;
