const Cart = require('../models/cart');
const Product = require('../models/product'); 


exports.addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json(Cart);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error });
    }
};

exports.updateCart = async (req, res) => {
    const { userId, itemId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === itemId
        );

        if (itemIndex > -1) {
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = quantity;
            }

            await cart.save();

            // Map through updated cart items and attach product info
            const itemsWithPrice = await Promise.all(
                cart.items.map(async (item) => {
                    const product = await Product.findById(item.productId);
                    if (!product) return null;

                    return {
                        productId: item.productId,
                        name: product.name,
                        price: product.price * item.quantity,
                        quantity: item.quantity,
                        total: product.price * item.quantity
                    };
                })
            );

            const filteredItems = itemsWithPrice.filter(item => item !== null);

            // Calculate cart subtotal
            const cartTotal = filteredItems.reduce((acc, item) => acc + item.total, 0);

            res.status(200).json({ items: filteredItems, cartTotal });
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error });
    }
};


exports.removeFromCart = async (req, res) => {
    const { itemId } = req.params;
    const { userId } = req.body;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove the item by matching ObjectId
        cart.items = cart.items.filter(item => item.productId.toString() !== itemId);

        await cart.save();

        // Map through remaining cart items and attach product info
        const itemsWithPrice = await Promise.all(
            cart.items.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) return null;

                return {
                    productId: item.productId,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                    total: product.price * item.quantity
                };
            })
        );

        const filteredItems = itemsWithPrice.filter(item => item !== null);

        // Calculate cart subtotal
        const cartTotal = filteredItems.reduce((acc, item) => acc + item.total, 0);

        res.status(200).json({ items: filteredItems, cartTotal });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error });
    }
};

exports.getCartItems = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemsWithPrice = await Promise.all(
            cart.items.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) return null; 

                return {
                    productId: item.productId,
                    name: product.name,
                    price: product.price * item.quantity,
                    quantity: item.quantity,
                    total: product.price * item.quantity
                };
            })
        );

        const filteredItems = itemsWithPrice.filter(item => item !== null);

        const cartTotal = filteredItems.reduce((acc, item) => acc + item.total, 0);

        res.status(200).json({ items: filteredItems, cartTotal });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart items', error });
    }
};
