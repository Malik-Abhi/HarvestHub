import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { fetchUserOrders } from '../utils/api';

const OrderHistory = () => {
    const { orders, setOrders } = useStore();

    useEffect(() => {
        const getOrders = async () => {
            const userOrders = await fetchUserOrders();
            setOrders(userOrders);
        };

        getOrders();
    }, [setOrders]);

    return (
        <div className="order-history">
            <h2>Your Order History</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul>
                    {orders.map(order => (
                        <li key={order._id}>
                            <h3>Order ID: {order._id}</h3>
                            <p>Total Amount: ₹{order.totalAmount}</p>
                            <p>Address: {order.address}</p>
                            <p>Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderHistory;