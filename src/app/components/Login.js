'use client'; // Add this directive to indicate it's a client component

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserContext from './UserContext';
import './Login.css';

export default function Login() {
  const { userData, setUserData } = useContext(UserContext);
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    console.log("storedUserData:", storedUserData);
    try {
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        console.log("parsed userData:", userData);
        setUserData(userData);
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error);
    }
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const handleGoHome = () => {
    router.push('/'); // Navigate to home page
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:3001/api/login', formData);
        const userData = response.data;
        setUserData({
            token: response.data.token,
            user: response.data.user,
        });
        localStorage.setItem('userData', JSON.stringify(userData));
        if (userData.user.isAdmin) {
            router.push('/AdminMainScreen');
        } else {
            router.push('/');
        }
    } catch (err) {
        console.error('Login failed: ', err);
        alert(err.response?.data?.msg || 'Login failed. Please try again.');
    }
};

  const handleForgotPassword = () => {
    router.push('/forgot-password'); // Navigate to the forgot password page
  };

  return (
    <div className="login">
      <button onClick={handleGoHome} className="back-to-home">Back to Home</button> {/* Back to Home Button */}
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleLogin}>
        <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleInputChange}
        />
        <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleInputChange}
        />
        <div className="button-group">
            <button type="submit" className="login">Login</button> {/* Ensure it's type="submit" */}
            <button type="button" className="register" onClick={handleRegister}>Register</button>
            <button type="button" className="forgot" onClick={handleForgotPassword}>Forgot my Password</button>
        </div>
        </form>
      {error && <p>{error}</p>}
    </div>
  );
}
