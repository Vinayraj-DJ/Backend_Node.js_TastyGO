const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  productName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  qty: {
    type: Number,
    required: true,
    default: 1
  },
  image: {
    type: String
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Placed"
  },
  shippingAddress: {
    type: String,
    default: "Customer Delivery Address"
  },
  paymentMethod: {
    type: String,
    default: "UPI"
  },
  paymentStatus: {
    type: String,
    enum: ["Completed", "Pending", "Failed"],
    default: "Completed"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);
