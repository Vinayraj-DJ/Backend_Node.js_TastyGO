// const express = require("express");

// const mongoose = require("mongoose");
// const vendorRoutes = require("./routes/vendorRoutes");
// const firmRoutes = require("./routes/firmRoutes");   // Import Firm Routes
// const connectDB = require("./config/db");
// const dotenv = require("dotenv");
// const path = require("path");   // Import Path Module
// const productRoutes=require("./routes/productRoutes")
// const cors=require("cors")
// dotenv.config();


// const app = express();

// const PORT = process.env.PORT || 5000;

// // Connect Database
// connectDB();

// // mongoose.connect(process.env.MONGO_URL)
// // .then(()=>{
// //     console.log("mongoDB connected successfully")
// // })
// // .catch((error)=>{
// // console.log(error)
// // })

// // Middleware to Read JSON Data
// app.use(express.json());
// app.use(cors());
// // Make Uploads Folder Public
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Vendor Routes
// app.use("/vendor", vendorRoutes);

// // Firm Routes
// app.use("/firm", firmRoutes);

// // Product Routes
// app.use("/product", productRoutes);

// // Home Route
// app.get("/", (req, res) => {
//     res.send("<h1>TastyGo Backend API Server is Running</h1>");
// });

// app.listen(PORT, () => {

//     console.log(`Server is running on port no: ${PORT}`);

// });









const express = require("express");

const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const userRoutes = require("./routes/userRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const path=require("path")

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware to Read JSON Data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// User Routes (Customer Authentication)
app.use("/user", userRoutes);

// Vendor Routes
app.use("/vendor", vendorRoutes);

// Firm Routes
app.use("/firm", firmRoutes);

// Product Routes
app.use("/product", productRoutes);

// Order Routes
app.use("/order", orderRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("<h1>TastyGo Backend API Server is Running</h1>");
});

app.listen(PORT, () => {
    console.log(`Server is running on port no: ${PORT}`);
});