'use client';

import { useState, useEffect } from 'react';
import './EditProfile.css';
import axios from 'axios';

export default function EditProfile() {
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    cardType: '',
    cardNumber: '',
    expirationDate: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    promotions: false,
    paymentCards: [],
  });

  const [initialData, setInitialData] = useState({}); // To store initial data for reset
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    axios.get('http://localhost:3001/api/users')
      .then(response => {
        setUserData(response.data);
        setInitialData(response.data); // Save the initial data for reset
      })
      .catch(error => {
        console.error(error);
        setError('Failed to load user data.');
      });
  }, []);

  const handleCardChange = (e, index) => {
    const updatedCards = [...userData.paymentCards];
    updatedCards[index] = e.target.value;
    setUserData({ ...userData, paymentCards: updatedCards });
  };

  const handleAddCard = () => {
    if (userData.paymentCards.length < 4) {
      setUserData({ ...userData, paymentCards: [...userData.paymentCards, ''] });
    } else {
      alert('You can only add up to 4 payment cards.');
    }
  };

  const handleRemoveCard = (index) => {
    const updatedCards = [...userData.paymentCards];
    updatedCards.splice(index, 1);
    setUserData({ ...userData, paymentCards: updatedCards });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if the essential fields are filled (like name, email)
    if (!userData.name) {
      alert('Please fill in your name and email.');
      return;
    }
  
    // If name and email are provided, proceed to update the profile
    axios.put('http://localhost:3001/api/users', userData)
      .then(() => alert('Profile updated successfully'))
      .catch(error => {
        console.error(error);
        setError('Failed to update profile.');
      });
  };
  

  const handleCancel = () => {
    setUserData(initialData); // Reset the form data to initial values
  };

  return (
    <div className="edit-profile">
      <h2 className="edit-profile-title">Edit Profile</h2>
      {error && <div className="error-message">{error}</div>} {/* Error Message */}
      <form onSubmit={handleSubmit}>
        <div className="personal-info">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={userData.email}
            readOnly
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
        </div>
        
        <div className="payment-info">
          {userData.paymentCards.map((card, index) => (
            <div key={index} className="payment-card">
              <select
                name="cardType"
                value={userData.cardType}
                onChange={(e) => setUserData({ ...userData, cardType: e.target.value })}
              >
                <option value="">Select Card Type</option>
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="Amex">American Express</option>
              </select>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={card}
                onChange={(e) => handleCardChange(e, index)}
              />
              <input
                type="text"
                name="expirationDate"
                placeholder="Expiration Date (MM/YY)"
                value={userData.expirationDate}
                onChange={(e) => setUserData({ ...userData, expirationDate: e.target.value })}
              />
              <button type="button" onClick={() => handleRemoveCard(index)}>Remove</button>
            </div>
          ))}
          {userData.paymentCards.length < 4 && (
            <button type="button" onClick={handleAddCard}>Add Payment Card</button>
          )}
        </div>

        <div className="billing-address">
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            value={userData.street}
            onChange={(e) => setUserData({ ...userData, street: e.target.value })}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={userData.city}
            onChange={(e) => setUserData({ ...userData, city: e.target.value })}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={userData.state}
            onChange={(e) => setUserData({ ...userData, state: e.target.value })}
          />
          <input
            type="text"
            name="zip"
            placeholder="Zip Code"
            value={userData.zip}
            onChange={(e) => setUserData({ ...userData, zip: e.target.value })}
          />
        </div>

        <div className="promotions">
          <label>
            <input
              type="checkbox"
              checked={userData.promotions}
              onChange={(e) => setUserData({ ...userData, promotions: e.target.checked })}
            />
            Register for promotions
          </label>
        </div>

        <div className="button-group">
          <button type="submit" className="save">Save Changes</button>
          <button type="button" className="cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
