const Vendor=require('../models/Vendor')
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const cleanedEmail = email ? email.trim() : "";
        const vendorEmail = await Vendor.findOne({ email: cleanedEmail });
        if (vendorEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        } 

        const hashedPassword = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({
            username,
            email: cleanedEmail,
            password: hashedPassword
        });

        await newVendor.save();
        res.status(201).json({
            success: true,
            message: "Vendor registered successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const vendorLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const cleanedEmail = email ? email.trim() : "";
        const vendor = await Vendor.findOne({ email: cleanedEmail });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Invalid Email"
            });
        }

        const isMatch = await bcrypt.compare(password, vendor.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                vendorId: vendor._id
            },
            process.env.JWT_SECRET || "this is my secrete key",
            {
                expiresIn: "1h"
            }
        );

        let firmId = null;
        if (vendor.firm && vendor.firm.length > 0) {
            const firstFirm = vendor.firm[0];
            firmId = firstFirm && firstFirm._id ? firstFirm._id.toString() : firstFirm.toString();
        }

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token: token,
            firmId,
            vendor: {
                id: vendor._id,
                username: vendor.username,
                email: vendor.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Vendors
const getAllVendors = async (req, res) => {

    try {

        // Get all vendors and replace Firm IDs with Firm Details
        const vendors = await Vendor.find()
            .populate("firm");

        // Send Response
        return res.status(200).json({

            success: true,

            message: "All Vendors Fetched Successfully",

            totalVendors: vendors.length,

            vendors

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Get Single Vendor Record
const getVendorById = async (req, res) => {

    try {

        // Get Vendor ID from URL
        const vendorId = req.params.id;

        // Find Vendor by ID
        // populate() replaces Firm ID with Firm Details
        const vendor = await Vendor.findById(vendorId)
            .populate("firm");

        // Check Vendor Exists or Not
        if (!vendor) {

            return res.status(404).json({

                success: false,

                message: "Vendor Not Found"

            });

        }

        // Success Response
        return res.status(200).json({

            success: true,

            message: "Vendor Record Fetched Successfully",

            vendor

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

module.exports = {
    vendorRegister,
    vendorLogin,
    getAllVendors,
    getVendorById
};