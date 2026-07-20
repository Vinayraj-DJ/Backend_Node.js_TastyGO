const express = require("express");
const router = express.Router();
const { userRegister, userLogin, getAllUsers, getUserById, updateUserProfile } = require("../controllers/userController");

// Registration API for User (Customer)
router.post("/register", userRegister);

// Login API for User (Customer)
router.post("/login", userLogin);

// Get All Users API
router.get("/all-users", getAllUsers);

// Get Single User API by ID
router.get("/single-user/:id", getUserById);

// Update User Profile API
router.put("/profile/update", updateUserProfile);

module.exports = router;
