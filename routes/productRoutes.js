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

// ===============================
// Add Product Route
// ===============================
// POST /product/add-product/:firmId
//
// verifyToken  -> Checks whether Vendor is Logged In
// upload.single("image") -> Uploads Product Image
// addProduct -> Saves Product into MongoDB
router.post(
    "/add-product/:firmId",
    verifyToken,
    upload.single("image"),
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
