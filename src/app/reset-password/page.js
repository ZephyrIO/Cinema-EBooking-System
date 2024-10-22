'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token'); // Get the token from the URL

  console.log(`Token from URL: ${token}`); // Log the token from the URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    try {
      const response = await axios.post(`http://localhost:3001/api/reset-password?token=${token}`, { password });
      setMessage('Password reset successfully. Redirecting to login...');
      console.log('Password reset success:', response.data); // Log success message from backend
      setTimeout(() => {
        router.push('/login'); // Redirect to login page after success
      }, 3000);
    } catch (error) {
      console.error('Error resetting password:', error); // Log error if password reset fails
      setError('Error resetting password.');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
