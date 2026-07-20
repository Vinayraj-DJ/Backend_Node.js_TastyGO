const Order = require("../models/Order");
const User = require("../models/User");

const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, email, paymentMethod, paymentStatus } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart items are required to place an order"
            });
        }

        let userId = req.userId;
        if (!userId && email) {
            const user = await User.findOne({ email });
            if (user) {
                userId = user._id;
            }
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Valid user account is required to place an order"
            });
        }

        const formattedItems = items.map(item => ({
            product: item._id || item.productId,
            productName: item.productName || item.name || "Food Item",
            price: Number(item.price || 0),
            qty: Number(item.qty || 1),
            image: item.image || (item.product && item.product.image) || ""
        }));

        const newOrder = new Order({
            user: userId,
            items: formattedItems,
            totalAmount: Number(totalAmount || 0),
            shippingAddress: shippingAddress || "Customer Delivery Address",
            paymentMethod: paymentMethod || "Cash on Delivery",
            paymentStatus: paymentStatus || "Pending",
            status: "Placed"
        });

        await newOrder.save();

        // Update the customer's profile address in the database with their checkout address
        if (shippingAddress) {
            await User.findByIdAndUpdate(userId, { address: shippingAddress });
        }

        return res.status(201).json({
            success: true,
            message: "Order Placed Successfully! Your food is on its way!",
            order: newOrder
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        let targetUserId = userId;

        if (userId && userId.includes("@")) {
            const user = await User.findOne({ email: userId.trim() });
            if (user) {
                targetUserId = user._id;
            } else {
                return res.status(200).json({
                    success: true,
                    totalOrders: 0,
                    orders: []
                });
            }
        }

        const orders = await Order.find({ user: targetUserId })
            .populate("items.product")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalOrders: orders.length,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getVendorOrders = async (req, res) => {
    try {
        const { firmId } = req.params;
        const orders = await Order.find({ firm: firmId })
            .populate("user", "username email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalOrders: orders.length,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "username email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalOrders: orders.length,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            order: updatedOrder
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getVendorOrders,
    getAllOrders,
    updateOrderStatus
};
