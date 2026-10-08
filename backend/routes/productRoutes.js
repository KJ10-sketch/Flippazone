// here we will import the required modules

//first eill be Express
const express = require("express");
//import the product module
const Product = require("../models/product"); // the p is small letter in mf files' name
// we will also require the middlaware for the autoriziation and authentication
const {protect, admin} = require("../middleware/authMiddleware");

// first let us create a new router object router is equal to express.Router
const router = express.Router();



//@router POST /api/products/
// @description Create a new Product in the database
//@access  Private/Admin this is because only admins can create products
router.post("/",protect, admin,   async (req, res) => {
    try {
        // we will first destrucutre the product details form the request body
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock, 
            category, 
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;
        const product = new Product(
            {
            name,
            description,
            price,
            discountPrice,
            countInStock, 
            category, 
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id // this will be the ID of the Admin user creating the product (Reference to the admin user who created it)
        });

        // save the product to the database
        const createdProduct = await product.save();
        // now we need to respones witht the newly created product response
        res.status(201).json(createdProduct);
        
    } catch (error) {
        console.log(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).send("Server Error");
    }
});


//@route PUT /api/products/: id
//@desc Update an exixting  product by ID
//@access Private/Admin 
router.put("/:id", protect, admin, async (req,res) =>{
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock, 
            category, 
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;


        //Find prodcut by ID in the URL
        const product = await Product.findById(req.params.id);

        if(product) {
            //update product fields
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured  = 
                isFeatured !== undefined ? isFeatured: product.isFeatured; product.isFeatured ;
            product.isPublished = 
            isPublished !== undefined ? isPublished: product.isPublished; product.isPublished ;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;



            //  Save Updated  Product to the Database
            const updatedProduct =await product.save();
            res.json(updatedProduct);
        }else{
            res.status(404).json({message: "Product Not Found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server")
    }
});


//@route DELETE /api/products/:id
//@desc Delete a product by its ID from the Database
//@access Private/Admin users
router.delete("/:id", protect, admin,  async (req,res) =>{
     try {
        // try to find the product in the database by using the ID
        const  product =await Product.findById(req.params.id);

        if(product){
            //Remove it form the database
            await  product.deleteOne();
            res.json({message:"Product removed"});
        }else{
            //if the product dose not exist: respond with 404 status and error message
            res.status(404).json({message:"Product not found"})
        }
     } catch (error) {
        console.error(error);
        res.status(500).send({message:"Server Error"})
     }
});



//@route GET /api/products
//@desc  GET all products with optional query filter
//@access this will be public
router.get("/", async (req,res)=>{
    try {
         const {collections,
             size,
             color,
              gender, 
              minPrice,
               maxPrice, 
               sortBy,
               search, 
              cataegory,
              material,
             brand,
             limit
         } = req.query;

         let query = {};

         // we wwill first need to apply the FILTTER LOGIC bsed on the query parameters
         if(collections  && collection.toLocaleLowercase() !==  "all") {
            query.collections = collection
         }
         if(cataegory && cataegory.toLocaleLowercase() !==  "all") {
            query.category = cataegory
         }


         if(material){
            query.material = {$in: material.split(",")};
         }
         if(brand){
            query.brand = {$in: brand.split(",")};
         }
         if(size){
            query.size = {$in: size.split(",")};
         }
          


         if(color){
            query.colors = {$in: [color]};
         }
         if(gender) {
            query.gender = gender;
         }

         if(minPrice || maxPrice){
            query.price = {};
            if(minPrice) query.price.$gte = Number(minPrice); // here I have gorgettn to put the dollar symble
            if(maxPrice) query.price.$lte = Number(maxPrice); // here I have gorgettn to put the dollar symble
         }
         if(search) {
            query.$or =  [
                {name: {$regex: search, $options: "i"}}, 
                {description: {$regex: search, $options: "i"}}
            ];
         }


         //Sort Options Logic gose here
         let sort = {};
         if(sortBy){
            switch (sortBy){
                //  first case will be Price ascedning =>priceAsc
                case "priceAsc": 
                 sort = {price: 1}
                    break;
                    //price descending which will sort the price in the descending order
                case "priceDesc":
                    sort = {price: -1};
                    break;
                case "popularity":
                    sort = {rating: -1};
                    break;
                default:
                    break;


                }
            }
         // Fetch products from the database and apply sorting and limit
         let products =await Product.find(query)
         .sort(sort)
         .limit(Number(limit) || 0);
         res.json(products);


    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

//Next we will eork on the best seller Route
//@route GET /api/products/best-seller
//@desc Retrive the product with highest selling rating
//@access Publblic
router.get("/best-seller", async(req, res) => {
    try {
       const bestSeller = await Product.findOne().sort({rating: -1});
       if(bestSeller){
        res.json(bestSeller);
       }else{
        res.status(404).json({message:"No best seller found"});
        console.error(error);
        res.status(500).send("Server Error");
       }
    } catch (error) {
        
    }
});


// here we will work on the new Arraivals section we will face at least eight products based on the creation date
//@route GET /api/products/new-arrivals
//@desc Retrieve latest 8 products -Creation date
//@access public
router.get("/new-arrivals", async (req,res)=>{
     try {
        // Fetch latest 8 products
        const newArrivals = await Product.find().sort({createdAt: -1}).limit(8);
        res.json(newArrivals);
     } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
     }
})










// Let us work on getting the singal product details
//@route GET  /api/products/:id
//@desc return a singal product by its ID
//@access public
router.get("/:id", async (req,res) => {
    try {
        // try to find the product provided using the provided ID
        const product = await Product.findById(req.params.id);
             //and it the product is present response has JSON
             if(product){
                res.json(product);
             } else{
                res.status(404).json({message: "Product Not Found"});
             }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});




//nest let us work on the similar products that will be visible on the product Details Page
//@route GET /api/products/similar/:id
//@desc Return Similar products based on the  current gender and category
//@access Public
router.get("/similar/:id", async (req,res) => { 
      // now extract the product ID from the request parameters
      const {id} = req.params;
      try {
        const  product = await Product.findById(id);

        if(!product){
            return res.status(404).json({message: "Product Not Found"});
        }

             /*
              here we will write the logic of finding the product  by matching the gender and category
             and we need to exclude the current product ID beacuse we don't want to the same product to be listed in the similar product 
             and Limit the number of similar products to four
            */

             /* 
             Consider adding sorting (by popularity, rating, etc.) to get more relevant similar products
             */
            const  similarProducts = await Product.find({
                _id: {$ne: id}, //Exculde the current product ID
                gender: product.gender,
                category: product.category
            }).limit(4);

            res.json(similarProducts);
        
      } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
        
      }
});






module.exports= router;