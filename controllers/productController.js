// Import Product Model
const Product = require("../models/Product");

// Import Firm Model
const Firm = require("../models/Firm");

// ===========================
// Add Product Controller
// ===========================
const addProduct = async (req, res) => {
    try {
        const { firmId } = req.params;

        if (!firmId) {
            return res.status(400).json({
                success: false,
                message: "Firm ID is required"
            });
        }

        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({
                success: false,
                message: "Firm Not Found"
            });
        }

        const { productName, price, category, description, bestSeller } = req.body;

        const isBestSeller = bestSeller === true || bestSeller === "Yes" || bestSeller === "true";

        const product = new Product({
            productName,
            price,
            category: category ? (Array.isArray(category) ? category : [category]) : [],
            description,
            bestSeller: isBestSeller,
            image: req.file ? req.file.filename : "",
            firm: firm._id
        });

        const savedProduct = await product.save();

        firm.product.push(savedProduct._id);
        await firm.save();

        return res.status(201).json({
            success: true,
            message: "Product Added Successfully",
            product: savedProduct
        });
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to add product"
        });
    }
};

const getProductsByFirm = async(req,res)=>{

    try{

        const {firmId}=req.params;


        const firm = await Firm.findById(firmId)
        .populate("product");


        if(!firm){

            return res.status(404).json({

                success:false,
                message:"Firm not found"

            });

        }


        res.status(200).json({

            success:true,

            ReasaturentName:firm.firmName,

            products:firm.product

        });


    }
    catch(error){

        console.log(error);

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};

const deleteProduct = async (req, res) => {
    try {

        const { productId } = req.params;

        // Find Product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Remove Product ID from Firm
        await Firm.findByIdAndUpdate(
            product.firm,
            {
                $pull: {
                    product: productId
                }
            }
        );

        // Delete Product
        await Product.findByIdAndDelete(productId);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// Export Controller
module.exports = {

    addProduct,
    getProductsByFirm,
    deleteProduct

};