'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import OrderConfirmation from '../components/OrderConfirmation';

const OrderConfirmationPage = () => {
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    // Extract query parameters from URL
    const movieTitle = searchParams.get('movie');
    const showtime = searchParams.get('showtime');
    const date = searchParams.get('date');
    const seats = JSON.parse(searchParams.get('seats') || '[]');
    const totalAmount = searchParams.get('totalAmount');

    // Create a booking details object from the parameters
    const bookingDetails = {
      bookingNumber: Math.random().toString(36).substr(2, 9).toUpperCase(),
      movie: {
        title: movieTitle,
        showtime,
        date,
      },
      seats,
      totalAmount,
    };

    setBookingDetails(bookingDetails);
  }, [searchParams]);

  return (
    <div>
      <div>
        <OrderConfirmation bookingDetails={bookingDetails} />
      </div>
      <div>
        <button type="button" className="cancel" onClick={() => window.location.href = '/'}>Home</button>
      </div>
    </div>
  );
  
};

export default OrderConfirmationPage;
