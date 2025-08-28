const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");

exports.createOrder = async (req, res) => {
    const { items, totalAmount } = req.body;
    const userId = req.user.id;

    try {
        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            createdAt: new Date()
        });

        await newOrder.save();

        await Cart.findOneAndUpdate(
            { userId },
            { $set: { items: [] } }
        );

        const itemsWithPrice = await Promise.all(
            items.map(async (item) => {
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

        const cartTotal = filteredItems.reduce((acc, item) => acc + item.total, 0);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: {
                _id: newOrder._id,
                userId: newOrder.userId,
                items: filteredItems,
                cartTotal,
                totalAmount: newOrder.totalAmount,
                createdAt: newOrder.createdAt
            }
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Error creating order",
            error
        });
    }
};


exports.getUserOrders = async (req, res) => {
    const userId = req.user.id;

    try {
        const orders = await Order.find({ userId }).populate('items.productId');

        // Reformat orders for usability
        const formattedOrders = orders.map(order => ({
            id: order._id,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            items: order.items.map(item => ({
                productId: item.productId?._id || item.productId,
                name: item.productId?.name || "Unknown",
                price: item.productId?.price || 0,
                quantity: item.quantity,
                total: (item.productId?.price || 0) * item.quantity
            }))
        }));

        res.status(200).json({ success: true, orders: formattedOrders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: 'Error fetching orders', error });
    }
};
