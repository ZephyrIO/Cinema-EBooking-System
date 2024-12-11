import React from 'react';
import { useRouter } from 'next/navigation';

const OrderCard = ({ order }) => {
    const router = useRouter();

    return (
        <div>
            <h4>Tickets for {order.movie.title} at {order.movie.showtime}</h4>
            <p>Purchased {order.tickets.length} tickets for a total of ${order.totalAmount}</p>
            <br />
        </div>
    );
};

export default OrderCard;