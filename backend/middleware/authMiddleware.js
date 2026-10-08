// this file will contain the middleware to protect routes

//import the JWT laibrary
const jwt =require("jsonwebtoken");
//import the user moudule
const user = require("../models/user");
//Middleware to prtect routes
const protect = async (req, res, next) => {
    // add a token variable
    let token;
    // we will first check if the authorization header exists
    // we will assing this header with the bearing string at the front end  while calling the request for the profile
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token=req.headers.authorization.split(" ")[1];
            const  decoded = jwt.verify(token,process.env.JWT_SECRET);

            //now that we haeve the user id we can easily ge the user information and attach it to the request.user
            req.user= await user.findById(decoded.user.id).select("-password"); // Excclude the password
            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }
            next();
        } catch (error) {
            console.log( "Token verfication failed:",error);
            // add responese with status 401
            res.status(401).json({message:"Not authorized token failed"});     
        }
    }else{
        res.status(401).json({message: "Not Authorized, no token provided"});
    }
};

//Middleware to check fn the user is an admin 
const admin = (req, res, next ) => {
    //if the request.user and request user role equal to admin allow the operation
    if(req.user && req.user.role === "admin"){
        // call the operation
        next();
    } else{
        res.status(403).json({message: "Not authorized as an admin"})
    }
}

module.exports =  {protect , admin};