import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CheckOutForm.css';
import { useRouter } from 'next/navigation';

const CheckOutForm = ({ movieDetails, onConfirm, userHasLinkedPayment, selectedSeats, seatCategories }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).token : null;

    if (token) {
      axios.get('http://localhost:3001/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setName(response.data.name);
          setEmail(response.data.email);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setError('Failed to load user data.');
        });
    } else {
      setError('User not logged in.');
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

    const totalBeforeTaxAndFees = ticketTotal;
    const totalAfterTax = totalBeforeTaxAndFees * (1 + salesTax);
    return parseFloat((totalAfterTax + onlineFee).toFixed(2));
  };

  const calculateTotalAfterDiscount = () => {
    const totalBeforeDiscount = calculateTotalBeforeDiscount();
    const totalWithDiscount = totalBeforeDiscount * ((100 - promoDiscount) / 100);
    return parseFloat(totalWithDiscount.toFixed(2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const paymentInfo = userHasLinkedPayment ? 'linked' : { cardNumber, expiryDate, cvv };

    const tickets = selectedSeats.map((seat, index) => ({
      seatNumber: seat,
      seatType: seatCategories[index],
      quantity: 1,
    }));

    const bookingDetails = {
      name,
      email,
      paymentInfo,
      tickets,
      totalAmount: calculateTotalAfterDiscount(),
      movie: {
        title: movieDetails.title,
        date: movieDetails.date, // Ensure this is being set
        time: movieDetails.time, // Ensure this is being set
      },
      promoCode,
    };
    

    try {
      const response = await axios.post('http://localhost:3001/api/submit-order', bookingDetails);

      if (response.status === 201) {
        // Store booking details in localStorage
        localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
        // Navigate to order confirmation page
        router.push('/order-confirmation');
      }
    } catch (error) {
      console.error('Checkout error:', error.response?.data || error.message);
      alert('There was an issue with your checkout. Please try again.');
    }
  };

  return (
    <div className="checkout-form">
      <h2>Check Out - {movieDetails.title}</h2>
      {error && <div className="error-message">{error}</div>}
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
          <label>Promo Code:</label>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button type="button" onClick={validatePromoCode}>Apply Promo</button>
          {promoMessage && <p>{promoMessage}</p>}
        </div>

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
          <button type="button" className="cancel" onClick={() => window.location.href = '/'}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CheckOutForm;
