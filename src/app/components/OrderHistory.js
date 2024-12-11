'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageUsers ()
{
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const userData = JSON.parse(localStorage.getItem('userData')); // Get userData from localStorage
            if (!userData || !userData.token) { // If token is not available
                setError('Authentication token is missing.');
                return;
            }
            
            try {
                const email = userData.user.email;
                const response = await axios.get(`/api/movies/orders/${email}`);
                setOrders(response.data);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders.');
            }
        };
        
        fetchOrders();
    }, []);
    
    if (error) {
        return <div>{error}</div>;
    }
    
    return (
        <div></div>
    )
}