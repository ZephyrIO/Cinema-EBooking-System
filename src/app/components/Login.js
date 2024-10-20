import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import UserContext from './UserContext';
import './Login.css';

export default function Login () {
    //const { userData, setUserData } = useContext(UserContext);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/login', formData);
            console.log(response.data)
            setUserData({
                token: response.data.token,
                user: response.data.user,
            });
            localStorage.setItem('auth-token', response.data.token);
            router.push('/');
        } catch (err) {
            console.error('Login failed: ', err);
            alert(err.response.data.msg);
        }
    };

    return (
        <div className="login">
            <h2 className="login-title">Login</h2>
            <form>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                />
                <div className="button-group">
                    <button type="submit" className="login">Login</button>
                    <button type="button" className="register">Register</button>
                </div>
            </form>
        </div>
    )
}