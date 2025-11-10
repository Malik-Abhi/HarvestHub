import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import {
    fetchCartItems,
    updateCartItem,
    removeFromCart,
    createOrder,
} from "../utils/api";

const Cart = () => {
    const { cartData, setCartItems } = useStore();
    const [error, setError] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const { user } = useStore();
    const cartItems = cartData.items || [];

    useEffect(() => {
        const getCartItems = async () => {
            try {
                if (user) {
                    const items = await fetchCartItems(user.userId, user.token);
                    setCartItems(items);
                }
            } catch (err) {
                setError("Failed to load cart items. Please try again.");
            }
        };
        getCartItems();
    }, []);

    const handleUpdateQuantity = async (itemId, quantity) => {
        const response = await updateCartItem(itemId, quantity, user.token, user.userId);
        setCartItems(response);
    };

    const handleRemoveItem = async (itemId) => {
        const response = await removeFromCart(itemId, user.token, user.userId);
        setCartItems(response);
    };

    useEffect(() => {
        if (cartItems) {
            const total = cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            setTotalAmount(total);
        }
    }, [cartItems]);

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        try {
            const paymentsClient = new window.google.payments.api.PaymentsClient({
                environment: "TEST", // switch to 'PRODUCTION' when live
            });

            const paymentDataRequest = {
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [
                    {
                        type: "CARD",
                        parameters: {
                            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                            allowedCardNetworks: ["VISA", "MASTERCARD"],
                        },
                        tokenizationSpecification: {
                            type: "PAYMENT_GATEWAY",
                            parameters: {
                                gateway: "example", // replace with your actual gateway
                                gatewayMerchantId: "exampleMerchantId",
                            },
                        },
                    },
                ],
                merchantInfo: {
                    merchantId: "12345678901234567890", // your real GPay merchant ID
                    merchantName: "HarvestHub",
                },
                transactionInfo: {
                    totalPriceStatus: "FINAL",
                    totalPriceLabel: "Total",
                    totalPrice: (totalAmount + 30).toFixed(2),
                    currencyCode: "INR",
                    countryCode: "IN",
                },
            };

            const ready = await paymentsClient.isReadyToPay({
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: paymentDataRequest.allowedPaymentMethods,
            });

            if (!ready.result) {
                setError("Google Pay is not available on this device or browser.");
                return;
            }

            // open GPay modal
            const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
            console.log("Payment success:", paymentData);
            alert("✅ Payment Successful via Google Pay!");

            // only create order now that payment succeeded
            const orderData = {
                items: cartItems,
                totalAmount: totalAmount + (cartItems.length ? 30 : 0),
                paymentInfo: paymentData.paymentMethodData?.info, // optional
            };

            const response = await createOrder(orderData, user.token);
            if (!response.success) {
                setError(response.message || "Order creation failed after payment.");
                return;
            }

            // refresh cart
            const items = await fetchCartItems(user.userId, user.token);
            setCartItems(items);
        } catch (err) {
            console.error(err);
            if (err.statusCode === "CANCELED") {
                setError("Payment was canceled by the user.");
            } else {
                setError("Payment or checkout failed. Please try again.");
            }
        }
    };

    return (
        <div className="cart-container">
            <div className="cart-summary glass-card">
                <div style={{ position: "sticky", top: "100px" }}>
                    <h2>Cart Summary</h2>

                    <div className="summary-row">
                        <span>Total Items</span>
                        <span>{cartItems.length || 0}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery Charges</span>
                        <span>₹ {cartItems.length ? "30" : 0}</span>
                    </div>
                    <div className="summary-row">
                        <span>Total Amount</span>
                        <span>
                            ₹ {cartItems.length ? totalAmount + 30 : totalAmount || 0}
                        </span>
                    </div>

                    <button className="checkout-btn" onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>

            <div className="cart-items">
                <h1>Your Shopping Cart</h1>
                {error && <div className="error-card glass-card">{error}</div>}
                {cartItems.length === 0 && !error ? (
                    <div className="empty-cart glass-card">
                        <h2>No items in your cart</h2>
                        <p style={{ marginBottom: "2rem" }}>
                            Looks like you haven’t added anything yet.
                        </p>
                        <a href="/products" className="browse-btn">
                            Browse Products
                        </a>
                    </div>
                ) : (
                    <div className="items-grid">
                        {cartItems.map((item) => (
                            <div key={item.productId} className="cart-item glass-card">
                                <h3>{item.name}</h3>
                                <p>Price: ₹{item.price}</p>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) =>
                                        handleUpdateQuantity(item.productId, e.target.value)
                                    }
                                    className="quantity-input"
                                />
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveItem(item.productId)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
