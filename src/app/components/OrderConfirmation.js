const OrderConfirmation = ({ bookingDetails }) => {
  if (!bookingDetails) return null;

  return (
    <div>
      <h2>Booking Confirmation</h2>
      <p>Booking Number: {bookingDetails.bookingNumber}</p>
      <p>Movie: {bookingDetails.movie.title} at {bookingDetails.movie.showtime}</p>
      <p>Seats:</p>
      <ul>
        {bookingDetails.seats.map((seat, index) => (
          <li key={index}>
            Seat {seat.seatNumber} - {seat.seatType === 'adult' ? 'Adult' : 'Child'}
          </li>
        ))}
      </ul>
      <p>Total Amount Paid: ${bookingDetails.totalAmount}</p>
    </div>
  );
};

export default OrderConfirmation;
