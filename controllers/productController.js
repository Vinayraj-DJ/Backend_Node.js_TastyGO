// Import Product Model
const Product = require("../models/Product");

// Import Firm Model
const Firm = require("../models/Firm");

// ===========================
// Add Product Controller
// ===========================
const addProduct = async (req, res) => {

    try {

        // Get Firm ID from URL
        const { firmId } = req.params;

        // Find Firm in Database
        const firm = await Firm.findById(firmId);

        // Check Firm Exists or Not
        if (!firm) {

            return res.status(404).json({

                success: false,

                message: "Firm Not Found"

            });

        }

        // Create New Product
        const product = new Product({

            // Get Product Name
            productName: req.body.productName,

            // Get Product Price
            price: req.body.price,

            // Get Product Category
            category: req.body.category,

            // Get Product Description
            description: req.body.description,

            // Store Uploaded Image Name
            image: req.file ? req.file.filename : "",

            // Connect Product with Firm
            firm: firm._id

        });

        // Save Product into MongoDB
        const savedProduct = await product.save();

        // Save Product ID inside Firm Collection
        firm.product.push(savedProduct._id);

        // Save Updated Firm
        await firm.save();

        // Get Product with Firm Details
        const populatedProduct = await Product.findById(savedProduct._id)
            .populate("firm");

        // Send Success Response
        return res.status(201).json({

            success: true,

            message: "Product Added Successfully",

            product: populatedProduct

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

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