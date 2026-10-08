//import mongoose
const mongoose =require("mongoose");
//define the checkoutItemSchema
const checkoutItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,

    },
    quantity: {
        type: Number,
        required: true,
    }, 
}, 
// for this Schema _id will be false
{_id: false}
);

//Le us define the checkout Schema
const checkoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    // this will array of checkoutItemsSchema
    checkoutitems: [checkoutItemSchema],
    shippingAddress: {
        address:{type: String, required: true},
        city:{type: String, required: true},
        postalCode:{type: String, required: true}, // If I decided to make the website to the Syrian Market I will delete this and put an alternative
        country:{type: String, required: true},
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,

    },
    paidAt: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        default: "pendding",
    },
    paymentDetails: {
        //type will be mixed
        type: mongoose.Schema.Types.Mixed, // this is beacuse it will store payment-related details(transaction ID, Paypal response).
    },
    isFinialized: {
        type: Boolean,
        default: false,
    },
    finializedAt: {
        type: Date,
    },
},
// Add the timeStamps
{timestamps: true}
);
module.exports =mongoose.model("Checkout",checkoutSchema)