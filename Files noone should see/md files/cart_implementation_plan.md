# Implementation Plan: E-commerce Cart System & Guest-to-User Merge

## 1. Objective
Build a robust shopping cart system for a MERN stack application that supports both guest (anonymous) and authenticated users. The primary challenge is seamlessly **merging** a guest's cart into a user's cart upon login without losing items or duplicating data.

## 2. Schema Design

### 2.1. CartItem Schema (Nested inside Cart)
This sub-document represents a single product line item in the cart. We use **denormalization** (storing `name`, `image`, `price` directly) to ensure the cart remains readable even if the original Product document is modified or deleted.

| Field | Type | Ref | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `productId` | ObjectId | Product | **Yes** | - | Reference to the actual product in the DB. |
| `name` | String | - | No | - | Snapshot of the product name. |
| `image` | String | - | No | - | Snapshot of the product image URL. |
| `price` | **Number** | - | **Yes** | - | **Critical Fix:** Must be Number, not String, for math operations. |
| `size` | String | - | No | - | Size variant (e.g., `M`, `L`). |
| `color` | String | - | No | - | Color variant (e.g., `Red`, `Blue`). |
| `quantity` | Number | - | No | 1 | Quantity of this specific item variant. |

### 2.2. Cart Schema (Root Document)
This is the parent document that links to either a guest or a logged-in user.

| Field | Type | Ref | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `user` | ObjectId | User | No | `null` | Reference to the logged-in user. |
| `guestId` | String | - | No | `null` | Unique UUID string for anonymous users (stored in localStorage). |
| `products` | Array | [CartItem] | **Yes** | `[]` | List of nested cart items. |
| `totalPrice` | Number | - | **Yes** | `0` | Cached sum total of all items. |
| `timestamps` | Object | - | Auto | `true` | Mongoose auto-generates `createdAt` and `updatedAt`. |

---

## 3. The Merge Algorithm: Guest to User
**Trigger:** Immediately after a successful login event on the backend.

1. **Identify Guest Cart:** Locate the cart associated with the provided `guestId` sent from the frontend.
2. **Identify User Cart:** Locate the cart associated with the `userId` from the authenticated token.
3. **Merge Loop:** Iterate through each item in the Guest Cart.
    - *Check:* Does the same product (matched by `productId`, `size`, and `color`) already exist in the User Cart?
    - *If Yes:* Increase the existing item's `quantity` by the guest's quantity.
    - *If No:* Add the guest's item as a new entry into the User Cart's `products` array.
4. **Cleanup:** Delete the Guest Cart document from the database to prevent orphaned records.
5. **Return:** Send the newly merged and saved User Cart back to the frontend.

---

## 4. Code Implementation (Mongoose + Express)

### 4.1. Model Definition (`models/Cart.js`)
```javascript
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String },
  image: { type: String },
  price: { type: Number, required: true }, // MUST be Number
  size: { type: String },
  color: { type: String },
  quantity: { type: Number, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    guestId: {
      type: String,
      default: null,
    },
    products: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Middleware: Auto-calculate totalPrice before saving
cartSchema.pre('save', function (next) {
  this.totalPrice = this.products.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);