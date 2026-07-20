const express = require("express");

const router = express.Router();

// Import Firm Controller
const { addFirm, getFirmById, deleteFirm } = require("../controllers/firmController");

// Import Verify Token Middleware
const verifyToken = require("../middleware/verifyToken");

// Import Multer Middleware
const upload = require("../middleware/upload");

router.get("/:firmId", getFirmById);

router.delete(
    "/delete-firm/:firmId",
    verifyToken,
    deleteFirm
);

// Add Firm API
router.post(

    "/add-firm",

    verifyToken,

    upload.single("image"),

    addFirm

);
module.exports = router;