const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    // Product Name
    productName: {
        type: String,
        required: true
    },

    // Product Price
    price: {
        type: Number,
        required: true
    },

    // Product Category
    category: {
        type: [{
            type: String,
            enum: ["veg", "non-veg"]
        }]
    },

    // Product Description
    description: {
        type: String,
        default: ""
    },

    // Product Image
    image: {
        type: String,
        default: ""
    },

    bestSeller: {
        type: Boolean,
        default: false
    },

    // Product belongs to one Firm
    firm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Firm",
        required: true
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);