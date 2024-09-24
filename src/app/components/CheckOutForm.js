import React, { useState, useEffect } from 'react';

const CheckOutForm = ({ movieDetails, userDetails, onConfirm, onCancel, userHasLinkedPayment }) => {
  const [name, setName] = useState(userDetails.name); // Set the initial value from userDetails
  const [email, setEmail] = useState(userDetails.email); // Set the initial value from userDetails
  const [promoCode, setPromoCode] = useState('');
  const [tickets, setTickets] = useState([{ type: 'adult', quantity: 1 }]);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const ticketPrices = {
    adult: 15,
    child: 10
  };
  const salesTax = 0.08; // Example 8% tax
  const onlineFee = 2.5; // Example fee per transaction

  // Promo code logic
  const validPromoCodes = { 'DISCOUNT10': 10 }; // Example: 10% discount for valid code

  useEffect(() => {
    if (validPromoCodes[promoCode]) {
      setPromoDiscount(validPromoCodes[promoCode]);
    } else {
      setPromoDiscount(0);
    }
  }, [promoCode]);

  const calculateTotal = () => {
    const ticketTotal = tickets.reduce((sum, ticket) => sum + (ticketPrices[ticket.type] * ticket.quantity), 0);
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
      tickets,
      totalAmount: calculateTotal(),
      movie: movieDetails,
      promoCode
    };

    onConfirm(bookingDetails);
  };

  const handleTicketChange = (index, type, quantity) => {
    const newTickets = [...tickets];
    newTickets[index] = { type, quantity: parseInt(quantity) };
    setTickets(newTickets);
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
          <label>Tickets:</label>
          {tickets.map((ticket, index) => (
            <div key={index}>
              <select
                value={ticket.type}
                onChange={(e) => handleTicketChange(index, e.target.value, ticket.quantity)}
              >
                <option value="adult">Adult - $15</option>
                <option value="child">Child - $10</option>
              </select>
              <input
                type="number"
                value={ticket.quantity}
                onChange={(e) => handleTicketChange(index, ticket.type, e.target.value)}
                min="1"
                required
              />
            </div>
          ))}
          <button type="button" onClick={() => setTickets([...tickets, { type: 'adult', quantity: 1 }])}>
            Add Ticket
          </button>
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
