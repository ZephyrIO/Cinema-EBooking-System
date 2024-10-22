import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserContext from './UserContext';
import './ResetPassword.css';

export default function ResetPassword ()
{
    const handleGoHome = () => {
        router.push('/'); // Navigate to home page
    };

    const [formData, setFormData] = useState({
        email: ''
    })

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/forgot', formData);
            console.log(response.data)
            //router.push('/');
        } catch (err) {
            console.error('Login failed: ', err);
            alert(err.response.data.msg);
        }
    };

    return (
        <div className="reset">
            <button onClick={handleGoHome} className="back-to-home">Back to Home</button> {/* Back to Home Button */}
            <h2 className="reset-title">Reset Password</h2>
            <form onSubmit={handleReset}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <div className="button-group">
                    <button type="submit" className="submit">Send Reset Mail</button>
                </div>
            </form>
            {error && <p>{error}</p>}
        </div>
    )
}