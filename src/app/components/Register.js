import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './Register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    cardType: '',
    cardNumber: '',
    expirationDate: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    recievePromotions: false,
  });

  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/register', formData);
      
      // If registration is successful, alert the message and redirect
      alert(response.data.message);
      window.location.href = '/register-confirm';
    } catch (error) {
      console.error('Error registering:', error);
      
      // Show the exact error message from the backend
      if (error.response && error.response.data) {
        alert(`Registration failed: ${error.response.data.message}`);
      } else {
        alert('Registration failed. Please try again.');
      }
    }
  };

  const handleLogin = () => {
    router.push('/login');
};

  const handleGoHome = () => {
    window.location.href = '/'; // Navigate to home page
  };

  return (
    <div className="register">
      <button onClick={handleGoHome} className="back-to-home">Back to Home</button> {/* Back to Home Button */}
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} />
        <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleInputChange} />
        <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleInputChange} />
        <input type="tel" name="phone" pattern="[0-9]{10}" placeholder="Phone # (1234567890)" required value={formData.phone} onChange={handleInputChange} />
        <select name="cardType" value={formData.cardType} onChange={handleInputChange}>
          <option value="">Select Card Type</option>
          <option value="Visa">Visa</option>
          <option value="Mastercard">Mastercard</option>
          <option value="Amex">American Express</option>
        </select>
        <input type="text" name="cardNumber" placeholder="Card Number" pattern="[0-9]{16}" value={formData.cardNumber} onChange={handleInputChange} />
        <input type="text" name="expirationDate" placeholder="Expiration Date (MM/YY)" value={formData.expirationDate} onChange={handleInputChange} />
        <input type="text" name="street" placeholder="Street Address" value={formData.street} onChange={handleInputChange} />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} />
        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} />
        <input type="text" name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleInputChange} />
        <label>
          <input
            type="checkbox"
            name="recievePromotions"
            checked={formData.recievePromotions}
            onChange={handleInputChange}
          />
          Register for promotions
        </label>
        <div className="button-group">
          <button type="submit" className="register">Register</button>
          <button type="button" className="login" onClick={handleLogin}>Login</button>
        </div>
      </form>
    </div>
  );
}
