const express = require("express");
const router = express.Router();
const {
    createOrder,
    getUserOrders,
    getVendorOrders,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

// Create Order API
router.post("/create", createOrder);

// Get User Order History
router.get("/user-orders/:userId", getUserOrders);

// Get Vendor / Firm Incoming Orders
router.get("/vendor-orders/:firmId", getVendorOrders);

// Get All Orders
router.get("/all-orders", getAllOrders);

// Update Order Status
router.put("/update-status/:orderId", updateOrderStatus);

module.exports = router;
