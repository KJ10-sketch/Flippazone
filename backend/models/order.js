//import mongoose
const mongoose =require("mongoose");


//define the order items Schema
const orderItemsShema = new mongoose.Schema({
    produtId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    Image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    size: String,
    color: String,
    quantity: {
        type: Number,
        required: true,
    },

},

//for this Sechma _id will bw false
{_id: false}
);

const orderSchema =  new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,

    },
    orderitems: [orderItemsShema],
    shippingAdress: {
        address: {type: String, required: true},
        city: {type: String, required: true},
        postalCode: {type: String, required: true},
        country: {type: String, required: true},
    },
    PaymentMethod: {
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
    isDelivered: {
        type: Boolean,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        default: "pending",
    },
    status: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Processing",  
    },
}, {timestamps: true}
);
module.exports = mongoose.model("order", orderSchema);