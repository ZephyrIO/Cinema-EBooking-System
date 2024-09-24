'use client';
import React, { useState } from 'react';
import CheckOutForm from '../components/CheckOutForm';
import OrderConfirmation from '../components/OrderConfirmation';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const CheckoutPage = () => {
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const movieDetails = {
    title: 'Inception',
    price: 15.99,
  };

  const userDetails = {
    name: 'John Doe',
    email: 'johndoe@example.com',
  };

  const userHasLinkedPayment = false; // Assume no linked payment info for now

  const handleConfirm = async (details) => {
    try {
      const response = await axios.post('/api/submit-order', details);

      // Assume response contains the booking number and order details
      const bookingData = response.data;

      setBookingDetails(bookingData);  // Set booking details to display in confirmation page
      setIsConfirmed(true);  // Trigger the confirmation page rendering
    } catch (error) {
      console.error('Error submitting the order:', error);
    }
  };

  const handleCancel = () => {
    router.push('/'); // Redirect to homepage on cancel
  };

  return (
    <div>
      {!isConfirmed ? (
        <CheckOutForm
          movieDetails={movieDetails}
          userDetails={userDetails}
          userHasLinkedPayment={userHasLinkedPayment}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      ) : (
        <OrderConfirmation bookingDetails={bookingDetails} />
      )}
    </div>
  );
};

export default CheckoutPage;
