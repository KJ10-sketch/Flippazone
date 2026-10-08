// this filoe will connect our application to mongodb database

//import the mongoose laibrary
const mongoose = require("mongoose");


// add a function ConnectDB: and it will be an asynchronous function
const connectDB =  async () => {
    // add a try block
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MogoDB connected successfully");
        
    } 
    // add a catch block with error
    catch(err) {
        console.error("MongoDB connection failed",err);
        process.exit(1);
    }
};

module.exports = connectDB;