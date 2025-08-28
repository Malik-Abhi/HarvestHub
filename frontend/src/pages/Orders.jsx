import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { fetchUserOrders } from '../utils/api';

const Orders = () => {
    const { orders, setOrders, user } = useStore();
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const getOrders = async () => {
            if (user) {
                const fetchedOrders = await fetchUserOrders(user.id, user.token);

                // Ensure only the array of orders goes to store
                if (fetchedOrders?.success) {
                    setOrders(fetchedOrders.orders || []);
                } else {
                    setOrders([]);
                }
            }
        };
        getOrders();
    }, [user, setOrders]);

    return (
        <div className="orders-page">
            <h1 className="page-title">Your Orders</h1>

            {(!orders || orders.length === 0) ? (
                <p>No orders found.</p>
            ) : (
                <div className="orders-grid">
                        {orders && orders.length>0&&orders.map(order => (
                        <div
                            key={order.id}
                            className="order-card glass-card"
                            onClick={() => setSelectedOrder(order)}
                        >
                            <h2>Order #{order.id.slice(-6)}</h2>
                            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal glass-card" onClick={(e) => e.stopPropagation()}>
                        <h2>Order Details</h2>
                        <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                        <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}</p>
                        <p><strong>Created At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>

                        <h3>Items</h3>
                        {selectedOrder.items.length === 0 ? (
                            <p>No items in this order.</p>
                        ) : (
                            <ul>
                                {selectedOrder.items.map((item, idx) => (
                                    <li key={idx}>
                                        {item.name} x{item.quantity} – ₹{item.total}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <button
                            className="close-btn"
                            onClick={() => setSelectedOrder(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
