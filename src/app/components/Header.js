import React, { useContext } from 'react';
import Link from 'next/link';
import UserContext from './UserContext';
import { useState, useEffect } from 'react';

export default function Header({logoutHandler}) {
    const { userData, setUserData } = useContext(UserContext);
    const [isToken, setIsToken] = useState(false);


    useEffect(() => {
        console.log('isToken', isToken);
    }, [isToken]);

    useEffect(() => {
        const storedUserDataString = localStorage.getItem('userData');
        if (storedUserDataString && storedUserDataString !== "undefined") {
            try {
                const storedUserData = JSON.parse(storedUserDataString);
                if (storedUserData && storedUserData.token) {
                    setUserData(storedUserData);
                    setIsToken(true);
                }
            } catch (error) {
                console.error("Error parsing stored user data", error);
            }
        }
    }, []);

    useEffect(() => {
        setIsToken(!!(userData && userData.token));
        localStorage.setItem('userData', JSON.stringify(userData));
    }, [userData]);

    return (
        <div>
        </div>
    );
}