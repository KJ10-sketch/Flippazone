// import the mongoose laibrary
const mongoose =require("mongoose");
//Import the bcrypt js laibrary
const bcrypt = require("bcryptjs");

// Now we will work on definig the users schema
   // we will make use of the new mongoose.Schema() which will help us define the structure , types  and validation rules for the entries in our database
const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        //the filed of email
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            // add a match property to our email field
            match: [/.+\@.+\..+/, "Pleas Enter a valid email address"],
        },
        password: {
            type: String,
            required: true,
            // here the minimum lenth of the password should be at least 6
            minlenght: 6,
        },
        role: {
            type: String,
            enum:["customer", "admin"],
            default: "customer"
        },
    },
{ timestamps: true}
);

// Password hash Middleware

/*  
here we will decalre a password hash middleware that will hash the user's password before stroing it in our database
for this we will make use of the userSchema.pre("save") that will get executed before the save operation and it will be async operation we will use next parameter to make sure that the next middleware or other operation run after this code 
*/

 /* userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    //salt variable
   
     this variable make use of generate salt method that will take a number, the higher the number the most secure it will be but it can be slower 
     
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
}); */

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return; // just return, no next()
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // Mongoose waits for this function to finish automatically
});


// Match User  entered password to Hash passeord

/* 
Now that we are hashing the password that will compare the plain text password that the users enters during the login
for this we will call the matchPassword method and it will also be an async function which will take the password entered by the user. It will return a boolean value by using the compare function available in the bcyrpt laibrary

*/
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("User", userSchema);