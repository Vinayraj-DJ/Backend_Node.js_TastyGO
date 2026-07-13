const express = require("express");

const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");   // Import Firm Routes
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const path = require("path");   // Import Path Module
const productRoutes=require("./routes/productRoutes")
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// mongoose.connect(process.env.MONGO_URL)
// .then(()=>{
//     console.log("mongoDB connected successfully")
// })
// .catch((error)=>{
// console.log(error)
// })

// Middleware to Read JSON Data
app.use(express.json());

// Make Uploads Folder Public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Vendor Routes
app.use("/vendor", vendorRoutes);

// Firm Routes
app.use("/firm", firmRoutes);

app.use("/product",productRoutes)

app.listen(PORT, () => {

    console.log(`Server is running on port no: ${PORT}`);

});