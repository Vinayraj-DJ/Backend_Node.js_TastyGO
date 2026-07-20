// Import Firm Model
const Firm = require("../models/Firm");

// Import Vendor Model
const Vendor = require("../models/Vendor");

// Create Add Firm Controller
const addFirm = async (req, res) => {


    try {

        // Get Logged-in Vendor ID from verifyToken Middleware
        const vendorId = req.user._id;

        // Find Vendor using Vendor ID
        const vendor = await Vendor.findById(vendorId);

        // Check whether Vendor exists
        if (!vendor) {

            return res.status(404).json({

                success: false,

                message: "Vendor Not Found"

            });

        }
         if(vendor.firm.length>0){
        return res.status(400).json({message:"vendor can have only one firm"})
    }

        let imageString = "";
        if (req.file) {
            if (req.file.buffer) {
                const mimeType = req.file.mimetype || "image/jpeg";
                imageString = `data:${mimeType};base64,${req.file.buffer.toString("base64")}`;
            } else if (req.file.path || req.file.filename) {
                imageString = req.file.path || req.file.filename;
            }
        }

        // Create New Firm
        const firm = new Firm({

            // Get Firm Name from Postman
            firmName: req.body.firmName,

            // Get Area from Postman
            area: req.body.area,

            // Get Category from Postman
            category: req.body.category,

            // Get Region from Postman
            region: req.body.region,

            // Get Offer from Postman
            offer: req.body.offer,

            image: imageString

        });

        // Connect this Firm with the Logged-in Vendor
        // Since vendor is an array in Firm model,
        // push the Vendor ID into the array.
        firm.vendor.push(vendor._id);

        // Save Firm into MongoDB
        const savedFirm = await firm.save();
// addinf firm id
const  firmId=savedFirm._id
        // Save Firm ID inside Vendor Collection
        // Vendor model contains an array called "firm"
        vendor.firm.push(savedFirm._id);

        // Save Updated Vendor
        await vendor.save();

        // condition as only one fir m for a vendor

   
        // Fetch the newly saved Firm again
        // populate() replaces Vendor ID with complete Vendor Details
        // "-password" hides the password field
        const populatedFirm = await Firm.findById(savedFirm._id)
            .populate("vendor", "-password");

        // Success Response
        return res.status(201).json({

            success: true,

            message: "Firm Added Successfully",
            firmId:firmId

            // Send Firm with Vendor Details
            // firm: populatedFirm

        });

    }

    catch (error) {

        // If any error occurs
        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getFirmById = async (req, res) => {
    try {
        const { firmId } = req.params;

        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({
                success: false,
                message: "Firm not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Firm fetched successfully",
            firmName: firm.firmName,
            firm
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteFirm = async (req, res) => {
    try {

        const { firmId } = req.params;

        // Check if firm exists
        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({
                success: false,
                message: "Firm not found"
            });
        }

        // Delete all products of this firm
        await Firm.deleteMany({ firm: firmId });

        // Remove firm ID from Vendor
        await Vendor.updateMany(
            {},
            {
                $pull: {
                    firm: firmId
                }
            }
        );

        // Delete Firm
        await Firm.findByIdAndDelete(firmId);

        return res.status(200).json({
            success: true,
            message: "Firm deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Export Controller
module.exports = {

    addFirm,
    getFirmById,
    deleteFirm

};