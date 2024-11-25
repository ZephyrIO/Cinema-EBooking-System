'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const VerifyPage = ({ params }) => {
    const { token } = params;
    const [message, setMessage] = useState('Verifying your account...');
    const router = useRouter();

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                console.log('Token:', token);
                const response = await axios.get(`http://localhost:3001/api/verify/${token}`);
                console.log('Verification Response:', response.data);

                // Set message based on backend response
                setMessage(response.data.message);
            } catch (error) {
                console.error('Verification Error:', error.response?.data || error.message);

                // Set error message from backend or generic fallback
                setMessage(error.response?.data?.message || 'Verification failed. The link may be expired or invalid.');
            }
        };

        verifyAccount();
    }, [token]);

    const handleLoginRedirect = () => {
        router.push('/login');
    };

    return (
        <div>
            <h2>{message}</h2>
            {(message === 'Your account has been verified!' || message === 'Your account is already verified.') && (
                <button onClick={handleLoginRedirect}>Go to Login</button>
            )}
        </div>
    );
};

export default VerifyPage;
