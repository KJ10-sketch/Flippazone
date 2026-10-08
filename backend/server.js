const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const connectDB  = require("./config/db");
// declare a variable  userRoutes
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const checkoutRoutes = require("./routes/checkoutRoutes.js");
const orderRoutes = require("./routes/orderroutes.js"); 
const uploadRoutes = require("./routes/uploadRoutes.js");
const subscribeRoute = require("./routes/subscribeRoute.js");
const adminRoute = require("./routes/adminRoutes.js");
const productAdminRoutes = require("./routes/productAdminRoutes.js");
const adminOrderRoutes = require("./routes/adminOrderRoutes.js");





app.use(express.json());
// to communicate with React Server We will enable cross origin
app.use(cors());

// we will make use of 9000 PORT in our Backend server
const PORT = process.env.PORT || 3000; // here we changes the value to the .env file. It was 9000 here. || use the deafault port 3000

//Connect to MongoDB database
connectDB();
app.get("/",(req, res) =>{
    res.send("Welcome to Flippazone API!")
});

// API Routes will be here
app.use("/api/users", userRoutes); // Now this will preaper /api/users to all our userRoutes
app.use("/api/products", productRoutes); 
app.use("/api/cart", cartRoutes); 
app.use("/api/checkout", checkoutRoutes); 
app.use("/api/orders", orderRoutes); 
app.use("/api/upload", uploadRoutes);
app.use("/api/upload", subscribeRoute);


//Admin 
app.use("/api/admin/users", adminRoute);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);




//let us start the server on port 9000
app.listen(PORT, () => {
    console.log(`Server is running on on http://localhost:${PORT}`);
    
});