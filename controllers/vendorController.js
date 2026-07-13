const Vendor=require('../models/Vendor')
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const vendorRegister=async(req,res)=>{
    const {username,email,password}=req.body
    try{
    const vendorEmail=await Vendor.findOne({email})
    if(vendorEmail){
        return res.status(400).json({
            message:"Email alredy exists"
        })
    } 

    const hashedPassword=await bcrypt.hash(password,10)
    const newVendor=new Vendor({
        username,email,password:hashedPassword
    })

    await newVendor.save()
    res.status(201).json({
        message:"vendor registered successfully"
    })
}catch(error){
return res.status(500).json({
    message:error.message
})
}
}

const vendorLogin = async (req, res) => {

    // Get email and password from request body
    const { email, password } = req.body;

    try {

        // Find vendor using email
        const vendor = await Vendor.findOne({ email });

        // Check whether vendor exists
        if (!vendor) {

            return res.status(404).json({

                success: false,

                message: "Invalid Email"

            });

        }

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, vendor.password);

        // Check password
        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid Password"

            });

        }

        // Generate JWT Token
        const token = jwt.sign(

            // Payload
            {
                vendorId: vendor._id
            },

            // Secret Key
            process.env.JWT_SECRET,

            // Expiry Time
            {
                expiresIn: "1h"
            }

        );

        // Send Response
        return res.status(200).json({

            success: true,

            message: "Login Successful",

            token: token,

            vendor: {

                id: vendor._id,

                username: vendor.username,

                email: vendor.email

            }

        });

    }

    catch (error) {

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