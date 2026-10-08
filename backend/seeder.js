//Import mongoose
const mongoose = require("mongoose");
// require dotenv
const dotenv = require("dotenv");
//import the product module
const Product = require("./models/product");
const user = require("./models/user");
const Cart = require("./models/cart");

//import the products.js file from the dat folder
const products =require("./data/products");
const product = require("./models/product");


dotenv.config();


//Connect to MongoDB 
mongoose.connect(process.env.MONGO_URI);

// FUnction to seed the data
const seedData = async () =>{
    try {
        // Now Every time I run this file I want to clear the preious data: Products and Users
        await product.deleteMany();
        await user.deleteMany();
        await Cart.deleteMany();


        // Create an  default Admin User
        const createdUser = await user.create({
            name:"Admin User",
            email: "admin@example.com",
            password: "1234567",
            role: "admin"
        });


        // Assing the default  user ID to each product
        const userID = createdUser._id;
           //we will aslo appened this user ID so let's  look throught the products
           const sampleProducts = products.map((product) =>{
            return{...product,user: userID};
           });

       //Inser the product in the database
       await  product.insertMany(sampleProducts);    

       console.log("Product data seeded successfully!");
       process.exit();
    } catch (error) {
       console.error("Error seeding the data", error);
       process.exit(1);
    }
};


seedData();