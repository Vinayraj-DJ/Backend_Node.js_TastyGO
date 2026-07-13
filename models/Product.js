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
    category:{
        type:[{
            type:String,
            enum:["veg","non-veg"]
        }]
    },

    // Product Description
    description: {
        type: String,
        required: true
    },

    // Product Image
    image: {
        type: String
    },
    bestSeller:{
         type:String
    },
    discription:{
        type:String
    },

    // Product belongs to one Firm
    firm: [{

        type: mongoose.Schema.Types.ObjectId,

        ref: "Firm",

        required: true

    }]

},
{
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);