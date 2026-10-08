# Checkout & CheckoutItem Models

This file documents the Mongoose schemas used for the Checkout functionality, as outlined in the tutorial.

## 1. CheckoutItem Schema
| Field      | Type                     | Required | Description                     |
|------------|--------------------------|----------|---------------------------------|
| productId  | ObjectId (ref: Product)  | Yes      | The ID of the product.          |
| name       | String                   | Yes      | The name of the product.        |
| image      | String                   | Yes      | The URL of the product image.   |
| price      | Number                   | Yes      | The price of the product.       |
| size       | String                   | No       | The size of the product.        |
| color      | String                   | No       | The color of the product.       |
| quantity   | Number                   | Yes      | The quantity of the product.    |

### Mongoose Implementation Code
```javascript
const mongoose = require("mongoose");

const checkoutItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
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
});



# ######################################

#########################################
const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    checkoutItems: {
        type: [checkoutItemSchema],
        required: true,
    },
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
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
    paidAt: Date,
    paymentStatus: {
        type: String,
        default: "pending",
    },
    paymentDetails: {
        type: mongoose.Schema.Types.Mixed,
    },
    isFinalized: {
        type: Boolean,
        default: false,
    },
    finalizedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("Checkout", checkoutSchema);