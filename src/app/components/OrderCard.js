import React from 'react';
import { useRouter } from 'next/navigation';

const OrderCard = ({ order }) => {
    const router = useRouter();

    return (
        <div>
            <h3>{order.email}</h3>
            <p>{order.tickets.length}</p>
        </div>
    );
};

export default OrderCard;