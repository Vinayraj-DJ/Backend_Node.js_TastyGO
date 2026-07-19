// Import Vendor Model
// We use this to check whether the vendor exists in the database
const Vendor = require("../models/Vendor");

// Import JWT package
// We use this package to verify the JWT token
const jwt = require("jsonwebtoken");

// Create Verify Token Middleware
// Middleware runs before the controller
const verifyToken = async (req, res, next) => {

    try {

        // Get Authorization Header from the request
        // Example:
        // Authorization : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.....
        const authHeader = req.headers.authorization;

        // Check whether Authorization header is present
        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message: "Authorization Header Required(Token required)"

            });

        }

        // Split the Authorization header
        // Example:
        // "Bearer eyJhbGc12345"
        // After split:
        // ["Bearer","eyJhbGc12345"]

        // Take only the token (index 1)
        const token = authHeader.split(" ")[1];

        // Verify the JWT Token using the secret key
        // If token is valid, it returns decoded data
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "this is my secrete key"
        );

        // Find Vendor using Vendor ID stored inside the token
        const vendor = await Vendor.findById(decoded.vendorId);

        // Check whether Vendor exists
        if (!vendor) {

            return res.status(404).json({

                success: false,

                message: "Vendor Not Found"

            });

        }

        // Store Vendor Details inside request object
        // Now every controller can access vendor information
        // Example:
        // req.user._id
        // req.user.username
        // req.user.email
        req.user = vendor;

        // Go to the next middleware or controller
        next();

    }

    catch (error) {

        // If token is invalid or expired
        return res.status(401).json({

            success: false,

            message: "Invalid or Expired Token"

        });

    }

};

// Export Middleware
module.exports = verifyToken;