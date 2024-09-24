'use client';
import React, { useEffect, useState } from 'react';
import OrderConfirmation from '../components/OrderConfirmation';

const OrderConfirmationPage = () => {
  const [bookingDetails, setBookingDetails] = useState(null);

  
  useEffect(() => {
    const mockBookingDetails = {
      bookingNumber: 'ABC123456',
      movie: {
        title: 'Inception',
        showtime: '5:00 PM',
      },
      seats: [
        { seatNumber: 'A1', seatType: 'adult' },
        { seatNumber: 'A2', seatType: 'child' },
      ],
      totalAmount: '42.50',
    };
    
   
    setBookingDetails(mockBookingDetails);
  }, []);

  return (
    <div>
      <OrderConfirmation bookingDetails={bookingDetails} />
    </div>
  );
};

export default OrderConfirmationPage;
