'use client';

import { useState, useEffect } from 'react';
import './EditProfile.css';
import axios from 'axios';
import { useClient } from 'next/client';

export default function EditProfile() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3001/api/')
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="edit-profile">
      <h2 className="edit-profile-title">Edit Profile</h2>
      <form>
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
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
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
          <select name="cardType" placeholder="Card Type" value={userData.cardType}>
            <option value="">Select Card Type</option>
            <option value="Visa">Visa</option>
            <option value="Mastercard">Mastercard</option>
            <option value="Amex">American Express</option>
          </select>
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={userData.cardNumber}
            onChange={(e) => setUserData({ ...userData, cardNumber: e.target.value })}
          />
          <input
            type="text"
            name="expirationDate"
            placeholder="Expiration Date (MM/YY)"
            value={userData.expirationDate}
            onChange={(e) => setUserData({ ...userData, expirationDate: e.target.value })}
          />
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
        <div className="button-group">
          <button type="submit" className="save">Save Changes</button>
          <button type="button" className="cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
}
