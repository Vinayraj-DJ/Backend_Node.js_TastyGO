// Import Express
const express = require("express");

// Create Router Object
const router = express.Router();

// Import Product Controller
const { addProduct,getProductsByFirm,deleteProduct } = require("../controllers/productController");

// Import Verify Token Middleware
const verifyToken = require("../middleware/verifyToken");

// Import Multer Middleware
const upload = require("../middleware/upload");

// Upload error handler wrapper
const handleUpload = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            console.error("Multer/Cloudinary Upload Error:", err);
            return res.status(400).json({
                success: false,
                message: err.message || "Image upload failed"
            });
        }
        next();
    });
};

// ===============================
// Add Product Route
// ===============================
// POST /product/add-product/:firmId
//
// verifyToken  -> Checks whether Vendor is Logged In
// handleUpload -> Handles Product Image Upload cleanly
// addProduct -> Saves Product into MongoDB
router.post(
    "/add-product/:firmId",
    verifyToken,
    handleUpload,
    addProduct
);
router.get(
    "/firm/:firmId",
    getProductsByFirm
);

router.delete(
    "/delete-product/:productId",
    verifyToken,
    deleteProduct
);

// Export Router
module.exports = router;
