const express = require("express")
const router = express.Router();

const { vendorRegister, vendorLogin,getAllVendors,getVendorById } = require("../controllers/vendorController")

// Import JWT Middleware
const verifyToken = require("../middleware/verifyToken")

// Registration API
router.post("/register", vendorRegister)

// Login API
router.post("/login", vendorLogin)

router.get("/all-vendors", getAllVendors);

router.get("/single-vendor/:id", getVendorById);

// Protected API
router.get("/profile", verifyToken, (req, res) => {

    res.json({

        message: "Welcome Vendor",

        vendor: req.user

    });

});



module.exports = router