import React from 'react';

const OrderConfirmation = ({ bookingDetails }) => {
  const { bookingNumber, name, email, tickets, totalAmount, movie, promoCode } = bookingDetails;

  return (
    <div className="confirmation-page">
      <h2>Booking Confirmation</h2>
      <p>Thank you for your booking, {name}!</p>
      <p>Your booking number is: <strong>{bookingNumber}</strong></p>

      <h3>Order Details</h3>
      <ul>
        <li><strong>Movie:</strong> {movie.title}</li>
        <li><strong>Email:</strong> {email}</li>
        <li>
          <strong>Tickets:</strong> 
          {tickets.map((ticket, index) => (
            <p key={index}>
              {ticket.quantity} {ticket.type === 'adult' ? 'Adult' : 'Child'} Ticket(s)
            </p>
          ))}
        </li>
        {promoCode && <li><strong>Promo Code Applied:</strong> {promoCode}</li>}
        <li><strong>Total Amount Paid:</strong> ${totalAmount}</li>
      </ul>

      <p>A confirmation email has been sent to {email}. We hope you enjoy the movie!</p>
    </div>
  );
};

export default OrderConfirmation;
