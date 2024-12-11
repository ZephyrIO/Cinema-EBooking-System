'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import OrderCard from '@/app/components/OrderCard';

export default function ManageUsers ()
{
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            const userData = JSON.parse(localStorage.getItem('userData')); // Get userData from localStorage
            if (!userData || !userData.token) { // If token is not available
                setError('Authentication token is missing.');
                return;
            }
            
            try {
                const response = await axios.get('/api/orders/');
                setOrders(response.data);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders.');
            }
        };
        
        fetchOrders();

        const userData = JSON.parse(localStorage.getItem('userData'));
        const userEmail = userData.user.email;
        console.log(JSON.parse(localStorage.getItem('userData')));
        const filteredData = orders.filter(order => order.email === userEmail);
        setOrders(filteredData);
    }, []);

    const handleGoHome = () => {
        router.push('/'); // Navigate to home page
      };
    
    if (error) {
        return <div>{error}</div>;
    }
    
    return (
        <div>
            <button onClick={handleGoHome} className="back-to-home">Back to Home</button>
            {orders.length > 0 ? (
              orders.map(order => (
                <OrderCard key={order._id} order={order} />
              ))
            ) : (
              <p>User has no past order history.</p>
            )}
        </div>
    )
}