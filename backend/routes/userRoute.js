//Import express
const express = require("express");
//Import the user model
const User = require("../models/user");
// we will also be making use of the JWT: JSON Webtoken 
const jwt = require("jsonwebtoken");

//import the protect method
const{protect} = require("../middleware/authMiddleware");
//let'a create a new Route instance
const router = express.Router();

//@route POST /api/users/register
//@desc Register a new user
//@access public
router.post("/register",async (req, res) => {
    //extract name, email, passwrod from the request body
    const {name, email, password} = req.body;

    // add try and catch block 
    try {
          //here where our registration logic will go
          // registration logic
        let user = await User.findOne({email});
            //if the user is existed we will send 400 message
        if (user) return res.status(400).json({message: "User already exists"});

          // if the user dose not exist   we will create a new user instance with the provided details
        user = new User({name, email,password});
          // save the new user to the Database    
        await user.save();

       /*  res.status(201).json({
            user:{
                 _id: user._id,
                 name: user.name,
                 email: user.email,
                 role: user.role,
            }
        });
 */ 
// the previous code whix is the respone code we deleteded to use this instead

 //we want to be able to send a token along with the user details we will do this by making use of JSON Webtoken

 // Create JWT playload
      //thid payload will conatain information about user ID and role and the payload will get embeded in the token and we  will  decode it for authorizing the user at the backend
      const payload = {user:{id: user._id, role: user.role}};

      //Sign and return the token along with user data
      /* 
      we will make use of the method JWT.sign() that will generate a token using the provided playload and a secret key for signing
      we will need to pass the payload next will be a sevret key
      we will need to create a secret key for this and save it in the environment variable typiclly we will need to ensure that the key is at least 32 characters.
      -Specify the toeknvalidity using the expiresIn key in the video he set it for 40 hours for the course for a smooth recording  and editing purpose but you may want to keep  it for a shorter duration 

      then we will have a callback funstion that will provide us an error or genereta a token and if there is an error throw the error or send the user  and token response 
      */

      //create JWT playload
      jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "40h"}, (err, token) => {
        if(err) throw err;

        // Send the user and token respoense
        res.status(201).json({
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token, 
        })
      } );




    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error"); 
    }
});


/*
 Now next Route that we will  create is login 
 //@route POST /api//users/login
//@desc Authenticate user
//@access Public
add the router.post method
 */


//@route POST /api//users/login
//@desc Authenticate user
//@access Public
router.post("/login", async(req, res)=>{
    const {email,password} = req.body;

    try{
        //Fin the user by eamil
        let user = await User.findOne({email});
        if(!user) return  res.status(400).json({message: "Invalid Credentails"});
        const isMatch = await user.matchPassword(password);
             // ✅ ADD THIS LINE – define payload here!
            const payload = { user: { id: user._id, role: user.role } };
        if(!isMatch) return res.status(400).json({message: "Invalid Credentails"});

          jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "40h"}, (err, token) => {
        if(err) throw err;

        // Send the user and token respoense
        res.json({
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token, 
        })
      } );

    }
    catch (error){
        console.log(error);
        res.status(500).send("Server Error");
    }

});


//@route GET /api/users/profile
//@desc Get logged-in user's profile (protected Route)
//@access Private
// for it we need to cretae a middlaware to protect this request 
router.get("/profile",  protect,async (req, res) =>{
    res.json(req.user); //remember request.user is getting assigned in the  middleware
})

module.exports = router;