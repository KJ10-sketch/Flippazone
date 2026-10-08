const express =require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");
//imort the protect middleware
const { protect } = require("../middleware/authMiddleware");
const user = require("../models/user");
const products = require("../data/products");
const router = express.Router();


//This will be a helper function to get a card by user Id or gust ID
const getCart = async (userId,guestId ) => {
    if(userId) {
        return await Cart.findOne({user: userId});
    }else if(guestId ){
        return await Cart.findOne({guestId });
    }
    return null;
}



//@route POST  /api/cart
//@desc Add a product to the gust user or logged in user
//@access public
router.post("/",async (req, res)=>{
    const  {productId, quantity, size, color, guestId , userId} = req.body;
    try {
      // let us get the product from the product ID
      const product = await Product.findById(productId);
          // if yiu did not find the Product let us return status 404
          if(!product) return res.status(404).json({message: "Product Not Found"});
          
          //Detirmine if the user is logged in or gust
             // we will define a funstion get cart  which will take the user ID and  
          let cart = await getCart(userId, guestId );

          // if the cart exist we will need to upgrade it

          /*
          the reason why we want to check the index.......... 
           */
          if(cart){
            const productIndex = cart.products.findIndex((p) =>
              p.productId.toString() === productId && p.size === size &&
              p.color === color
        );
        // so we need if that particular product is present in the cart
        if(productIndex > -1){
            // the product aleardy exists, upadate the quantity
            cart.products[productIndex].quantity += quantity;
        }else{
            // add the new product if the product is not present in the cart
            cart.products.push({
                productId,
                name: product.name,
                image: product.images[0].url,
                price: product.price,
                size,
                color,
                quantity,
            })
        }

            // Recalculate the total price
    cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    await cart.save();
    return res.status(200).json(cart);
} else {
    // Create a new cart for the guest or user
    const newCart = await Cart.create({
    user: userId ? userId : undefined,
    guestId : guestId  ? guestId  : "guest_" + new Date().getTime(),
    products: [
        {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity
        },
    ],
    totalPrice: product.price * quantity,
});
return res.status(201).json(newCart); 
}      
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
});


//@route PUT the URL will be: /api/cart
//@desc Update product  quantity in the cart for a guest or logged-in user
//@access Public
router.put("/", async (req,res)=>{
    const {productId, quantity, size, color, guestId, userId} = req.body;

    try {
        let cart = await getCart(userId, guestId);
        if(!cart) return res.status(404).json({message :"Cart not found"});

        const productIndex = cart.products.findIndex(
             (p) =>p.productId.toString() === productId && 
             p.size === size &&
             p.color === color  
        ); 


        // if yoyu are able to find the variance of this product
        if(productIndex > -1 ){
            // then we can update the product quantity
            if(quantity > 0){
                cart.products[productIndex].quantity = quantity;
            }else{
                cart.products.splice(productIndex, 1);  //remove product if the quantity is zero
            }
            cart.totalPrice = cart.products.reduce(
                (acc, item)=> acc + item.price * item.quantity,
                0
            );
            // let us also save the cart
            await cart.save();
            return res.status(200).json(cart);
        }else{
            return res.status(404).json({message: "Product not found in cart"})
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server Error"});
    }
});


//@route  DELETE /api/cart
//@desc Remove product form the cart 
//@access Public
router.delete("/", async (req,res)=>{
    //destructure the request body
    const {productId, size, color, guestId,  userId} = req.body;
    try {
        let cart = await getCart(userId,guestId);

        if(!cart) return res.status(404).json({message: "cart not found"});
        const productIndex = cart.products.findIndex((p) => 
            p.productId.toString() === productId && 
            p.size === size && 
            p.color === color
        );

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
            // also upadate the total price
            cart.totalPrice = cart.products.reduce((acc, item)=> acc + item.price * item.quantity, 0);
            // llet us save the cart
            await cart.save();
            //after this let's response with the status 200
            return res.status(200).json(cart);  
        }else{
            return res.status(404).json({message: "product not found in the cart"})
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server Error"});
    }
});

//@route  Get /api/cart 
//@desc Get logged-in user's or guest users's cart
//access Public
router.get("/", async (req,es)=>{
      // get the user id and guest id from the request query
    const  {usreId, guestId} = req.query;


    try {
        const cart =await getCart(userId, guestId);
        if(cart){
            res.json(cart);
        }else{
            res.status(404).json({message: "cart not found "})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message : "Server Error"});
    }
});


//@route POST /api/cart/merge
//@desc  Merge guest cart into user cart on login
//@access Private
router.post("/merge", protect, async (req, res)=> {
    const {guestId} = req.body;

    try {
        //Find the guest cart and the user cart
        //first we will find the guest cart
        const guestCart =await Cart.findOne({guestId});
        const userCart =await Cart.findOne({user: req.user._id}); //pass the user ID 

        
        
        if(guestCart){
            if(guestCart.products.length === 0){
                return res.status(400).json({message: "Guest Cart In Empty"})
            }

            if(userCart){
                 //Merge guest cart into user cart
                 guestCart.products.forEach((guestItem) =>{
                    const productIndex = userCart.products.findIndex((item)=>
                          item.productId.toString () === guestItem.productId.toString() &&
                         item.size === guestItem.size && 
                         item.color ===  guestItem.color
                );
                if (productIndex > -1){
                    //If the item exists in the user cart , update the quantity
                    userCart.products[productIndex.quantity].quantity += guestitem.quantity;
                }else{
                    //OtherWise, add the guest item to the cart
                    userCart.products.push(guestItem);
                }
                 });


                 //let us alos update the total price
                 userCart.totalPrice = userCart.products.reduce(
                        (acc, item)=> acc + item.price * item.quantity,
                        0
                    );

                 // save the user cart
                 await userCart.save();
                 
                 //Remove  the guest cart after merging
                 try {
                    await Cart.findOneAndDelete({guestId});
                 } catch (error) {
                    console.error("Error Deleting  guest Cart:", error);
                 }
                 //let us also response with status 200
                 res.status(300).json(userCart); //pass the User cart
            } else{
                //if the user  has no existing cart, assing the guest cart to the user
                guestCart.user = req.user._id;
                guestCart.guestId = undefined; // should be undefined
                await guestCart.save();

                //respone with status 200
                res.status(200).json(guestCart); //psaa the guest cart 
            }
        } else{
            //check for user cart
            if(userCart){
                //if the guest cart has already been merged, return user cart
                return res.status(200).json(userCart); //pass user cart
            }
            res.status(404).json({message: "Guest cart not found"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
        
    }
})

module.exports = router;