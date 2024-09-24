import React, { useState, useEffect } from 'react';

const CheckOutForm = ({ movieDetails, userDetails, onConfirm, onCancel, userHasLinkedPayment, selectedSeats, seatCategories }) => {
  const [name, setName] = useState(userDetails.name); // Set the initial value from userDetails
  const [email, setEmail] = useState(userDetails.email); // Set the initial value from userDetails
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const ticketPrices = {
    adult: 15,
    child: 10
  };
  const salesTax = 0.08; 
  const onlineFee = 2.5; 

  // Promo code logic
  const validPromoCodes = { 'DISCOUNT10': 10 }; // Example: 10% discount for valid code

  useEffect(() => {
    if (validPromoCodes[promoCode]) {
      setPromoDiscount(validPromoCodes[promoCode]);
    } else {
      setPromoDiscount(0);
    }
  }, [promoCode]);

  // Calculate the total based on the selected seats and their types (adult/child)
  const calculateTotal = () => {
    const ticketTotal = selectedSeats.reduce((sum, seat, index) => {
      const seatType = seatCategories[index];
      return sum + ticketPrices[seatType];
    }, 0);
    const totalBeforeTaxAndFees = ticketTotal;
    const totalAfterTax = totalBeforeTaxAndFees * (1 + salesTax);
    const totalWithFees = totalAfterTax + onlineFee;
    const totalWithDiscount = totalWithFees * ((100 - promoDiscount) / 100);
    return totalWithDiscount.toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const paymentInfo = userHasLinkedPayment ? 'linked' : { cardNumber, expiryDate, cvv };

    const bookingDetails = {
      name,
      email,
      paymentInfo,
      seats: selectedSeats.map((seat, index) => ({
        seatNumber: seat,
        seatType: seatCategories[index]
      })),
      totalAmount: calculateTotal(),
      movie: movieDetails,
      promoCode
    };

    onConfirm(bookingDetails);
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
            onChange={(e) => setName(e.target.value)} // Allow editing
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Allow editing
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
          {promoDiscount > 0 && <p>Promo applied: {promoDiscount}% off</p>}
        </div>

        <h3>Total: ${calculateTotal()}</h3>

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
