const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const cleanedEmail = email ? email.trim() : "";
        const userEmail = await User.findOne({ email: cleanedEmail });
        if (userEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email: cleanedEmail,
            password: hashedPassword
        });

        await newUser.save();
        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const cleanedEmail = email ? email.trim() : "";
        const user = await User.findOne({ email: cleanedEmail });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid Email"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || "this is my secrete key",
            { expiresIn: "24h" }
        );

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        return res.status(200).json({
            success: true,
            message: "All Users Fetched Successfully",
            totalUsers: users.length,
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User Record Fetched Successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { email, username, phone, address } = req.body;
        const cleanedEmail = email ? email.trim() : "";
        const user = await User.findOneAndUpdate(
            { email: cleanedEmail },
            { username, phone, address },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    userRegister,
    userLogin,
    getAllUsers,
    getUserById,
    getUserProfile,
    updateUserProfile
};
