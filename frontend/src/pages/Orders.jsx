import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { fetchUserOrders } from "../utils/api";

const Orders = () => {
    const { orders, setOrders, user } = useStore();
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const getOrders = async () => {
            if (user) {
                const fetchedOrders = await fetchUserOrders(user.id, user.token);

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
        <div className="orders-page" style={{ padding: "3rem 2rem" }}>
            <h1 className="page-title" style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>
                Your Orders
            </h1>

            {!orders || orders.length === 0 ? (
                <div className="empty-orders glass-card" style={{ textAlign: "center", padding: "3rem", borderRadius: "15px" }}>
                    <h2 style={{ marginBottom: "0.5rem" }}>No Orders Found</h2>
                    <p style={{ color: "#777" }}>Once you place an order, it’ll show up here.</p>
                </div>
            ) : (
                <div
                    className="orders-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "1.5rem",
                    }}
                >
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="order-card glass-card"
                            style={{
                                padding: "1.5rem",
                                borderRadius: "15px",
                                cursor: "pointer",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            }}
                            onClick={() => setSelectedOrder(order)}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                        >
                            <h2 style={{ marginBottom: "0.5rem", color: "#2d6a4f" }}>
                                Order #{order.id.slice(-6)}
                            </h2>
                            <p style={{ marginBottom: "0.3rem" }}>
                                <strong>Total:</strong> ₹{order.totalAmount}
                            </p>
                            <p style={{ color: "#666" }}>
                                <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedOrder && (
                <div
                    className="modal-overlay"
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="modal glass-card"
                        style={{
                            width: "90%",
                            maxWidth: "500px",
                            padding: "2rem",
                            borderRadius: "20px",
                            position: "relative",
                            boxShadow: "0 0 20px rgba(0,0,0,0.2)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ marginBottom: "1rem", color: "#1b4332" }}>Order Details</h2>

                        <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                        <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}</p>
                        <p>
                            <strong>Created At:</strong>{" "}
                            {new Date(selectedOrder.createdAt).toLocaleString()}
                        </p>

                        <h3 style={{ marginTop: "1.5rem", color: "#2d6a4f" }}>Items</h3>
                        {selectedOrder.items.length === 0 ? (
                            <p>No items in this order.</p>
                        ) : (
                            <ul style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}>
                                {selectedOrder.items.map((item, idx) => (
                                    <li key={idx} style={{ marginBottom: "0.3rem" }}>
                                        {item.name} x{item.quantity} – ₹{item.total}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <button
                            className="close-btn"
                            onClick={() => setSelectedOrder(null)}
                            style={{
                                marginTop: "1.5rem",
                                background: "#2d6a4f",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                padding: "0.6rem 1.5rem",
                                cursor: "pointer",
                                float: "right",
                            }}
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
