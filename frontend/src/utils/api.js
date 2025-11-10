const API_URL = 'https://harvesthub-hyge.onrender.com/api';

// Reusable API call function
const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
    try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
        });

        const data = await response.json();

        return data;
    } catch (error) {
        return { error: true, message: error.message || "Network error" };
    }
};

// =======================
// Auth
// =======================
export const signup = (userData) => apiRequest("/auth/signup", "POST", userData);
export const login = (credentials) => apiRequest("/auth/login", "POST", credentials);

// =======================
// Products
// =======================
export const fetchProducts = () => apiRequest("/products");
export const fetchProductById = (productId) => apiRequest(`/products/${productId}`);

// =======================
// Cart
// =======================
export const addToCart = (cartData, token) => apiRequest("/cart/add", "POST", cartData, token);
export const updateCartItem = (itemId, quantity, token, userId) =>
    apiRequest("/cart/update", "PUT", { userId, itemId, quantity }, token);
export const removeFromCart = (itemId, token, userId) =>
    apiRequest(`/cart/${itemId}/remove`, "DELETE", { userId }, token);
export const fetchCartItems = (userId, token) =>
    apiRequest(`/cart/${userId}/items`, "GET", null, token);

// =======================
// Orders
// =======================
export const createOrder = (orderData, token) => apiRequest("/orders/checkout", "POST", orderData, token);
export const fetchUserOrders = (userId, token) => apiRequest(`/orders/`, "GET", userId, token);
