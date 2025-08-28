import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { fetchCartItems, updateCartItem, removeFromCart, createOrder } from "../utils/api";


const Cart = () => {
    const { cartData, setCartItems } = useStore();
    const [error, setError] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const { user } = useStore();
    const cartItems = cartData.items;

    useEffect(() => {
        const getCartItems = async () => {
            try {
                if (user){
                    const items = await fetchCartItems(user.userId, user.token);
                    setCartItems(items);
                }
            } catch (err) {
                setError(err+"Failed to load cart items. Please try again.");
            }
        };
        getCartItems();
    }, []);

    const handleUpdateQuantity = async (itemId, quantity) => {
        const response = await updateCartItem(itemId, quantity,user.token,user.userId);
        setCartItems(response);
    };

    const handleRemoveItem = async (itemId) => {
        const response = await removeFromCart(itemId, user.token, user.userId);
        setCartItems(response);
    };

    useEffect(() => {
        if (cartItems ){
            const total = cartItems.reduce((sum, item) => sum + item.price, 0);
            setTotalAmount(total);
        }
    }, [cartItems]);

    const handleCheckout = async () => {
        if(cartItems.length === 0){
            return;
        }
        try {
            const orderData = {
                items: cartItems,
                totalAmount: totalAmount + (cartItems.length ? 30 : 0),
            };
            const response = await createOrder(orderData, user.token);
            if (response.success == false) {
                setError(response.message || "Checkout failed");
            } else {
                alert("✅ Order placed successfully!");
                const items = await fetchCartItems(user.userId, user.token);
                setCartItems(items);
            }
        } catch (err) {
            setError("Checkout failed. Please try again.");
        }
    };
    return (
        <div className="cart-container">
            <div className="cart-summary glass-card">
                <div style={{ position: "sticky", top: "100px" }}>
                    <h2>Cart Summary</h2>

                    <div className="summary-row">
                        <span>Total Items</span>
                        <span>{cartItems?.length || 0}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery Charges</span>
                        <span>₹ {cartItems?.length ? "30" : 0}</span>
                    </div>
                    <div className="summary-row">
                        <span>Total Amount</span>
                        <span>₹ {cartItems?.length ? totalAmount+30 : totalAmount  || 0}</span>
                    </div>

                    <button className="checkout-btn" onClick={()=>{
                        handleCheckout();
                    }}>Proceed to Checkout</button>
                </div>
            </div>


            {/* Right Content */}
            <div className="cart-items">
                <h1>Your Shopping Cart</h1>
                {error && <div className="error-card glass-card">{error}</div>}
                {cartItems?.length === 0 && !error ? (
                    <div className="empty-cart glass-card">
                        <h2>No items in your cart</h2>
                        <p style={{marginBottom: "2rem"}}>Looks like you haven’t added anything yet.</p>
                        <a  href="/products" className="browse-btn">
                            Browse Products
                        </a>
                    </div>
                ) : (
                    <div className="items-grid">
                        {cartItems?.map((item) => (
                            <div key={item.productId} className="cart-item glass-card">
                                <h3>{item.name}</h3>
                                <p>Price: ${item.price}</p>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => handleUpdateQuantity(item.productId, e.target.value)}
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
