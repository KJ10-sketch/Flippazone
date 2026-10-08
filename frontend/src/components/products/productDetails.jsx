import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "../products/productGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";



const productDetails  = ({productId}) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProduct, loading, error, similarProducts } = useSelector(
         (state) => state.products
    );
    const { userId, guestId } = useSelector((state) => state.auth);
    // I do not know why the video has added "" inside the useState barckets
    const [mainImage, setMainImage] = useState();
    // here we declared few variables that needs to be passed when the user clicks  on the ADD TO CART button
    const [selectedSize, setSelectedSize] = useState(); 
    const [selectedColor,setSelectedColor] = useState();
    const [quantity, setQuantity] = useState(1); 
    const [isButtonDisabled,setIsButtonDisabled] = useState(false); // to diable or enable the button
 
        const productFetchId = productId || id;

        useEffect(() => {
        if (productFetchId) {
            dispatch(fetchProductDetails(productFetchId));
            dispatch(fetchSimilarProducts({ id: productFetchId }));
        }
        }, [dispatch, productFetchId]);


    useEffect(() => {
        if(selectedProduct?.images?.length > 0){
            setMainImage(selectedProduct.images[0].url);
        }
    },  [selectedProduct]);
    const handleQuantityChange =(action) =>{
        if(action === "plus") setQuantity((prev) =>prev + 1);
        if(action === "minus" && quantity > 1) setQuantity((prev) =>prev - 1  );
    };
    const handleAddToCart = () => {
        if(!selectedSize ||  !selectedColor){
            toast.error("Pleas select a size and color before adding to cart", {
                duration:1000,
            });
            return;
        }
        setIsButtonDisabled(true);
       
        dispatch(
        addToCart({
            productId: productFetchId,
            quantity,
            size: selectedSize,
            color: selectedColor,
            guestId,
            userId: userId,
        })
        ).then(() => {
            toast.success("Product added to cart!", {
             duration: 1000,
           });
        })
        .finally(() => {
          setIsButtonDisabled(false);
       });

       
    }
    if (loading) {
         return <p>Loading...</p>
        }

        if (error) {
         return <p>Error: {error}</p>
        }
    return(
        <div className="p-6"> 
        {selectedProduct && (
                 <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
                        {/* this div holds the content */}
                        <div className=" flex flex-col md:flex-row">
                            {/* Left Thumbnails */}
                            <div className="hidden md:flex flex-col space-y-4 mr-6">
                                {selectedProduct.images.map((images, index) =>(
                                    <img 
                                    key={index}
                                    src={images.url} 
                                    alt={images.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === images.url ? "border-black" :"border-gray-300"}`} //if the image is selected make the border black else make it the border gray 300
                                     onClick={() => setMainImage(images.url)} //we passed this as a function
                                     /> 
                                    // here there was an error I made which is I put cappitital I at the begging of images instead of small i that will make the pictures not appear as pictures they will apear as alt text instead
                                ))}
                            </div>
                            {/* Mian Image */}
                            <div className="md:W-1/2">
                                <div className="mb-4">
                                    <img 
                                    /* src={selectedProduct.images[0]?.url}  */
                                    src={mainImage}
                                    alt="Main Product"
                                    className="w-full h-auto object-cover rounded-lg" 
                                    />
                                </div>
                            </div>
                            {/* Mobile Thumbnails: here the thumbnails should appear below the image in the mobile version */}
                            <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
                                {selectedProduct.images.map((images, index) =>(
                                    <img 
                                    key={index}
                                    src={images.url} 
                                    alt={images.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === images.url ? "border-black" :"border-gray-300"}`} //with copying the same code from above the mobile version should work as expected and yes it is working 
                                    onClick={() => setMainImage(images.url)}
                                    /> 
                                ))}
                            </div>

                            {/* Right Side */}
                            <div className="md:w-1/2 md:ml-10">
                                
                                <h1 className="text-2xl md:text-3xl font-semibold"> 
                                    {selectedProduct.name}
                                </h1>
                                    
                                <p className="text-lg text-gray-600 mb-1 line-through"> 
                                    {/* here we added the class line-throgh cuz we want to the customer to see that there is an offer on the product */}
                                ${selectedProduct.originalPrice &&`${selectedProduct.originalPrice}`} 
                                    {/* chck to see if origialPrice is present if it is present display it using the dollar sign */}
                                </p>

                                {/* this paragraph is for price */}
                                <p className="text-xl text-gray-500 mb-2">
                                    $ {selectedProduct.price}
                                </p>

                                {/* paragraph for description */}
                                <p className="text-gray-600 mb-4">
                                    {selectedProduct.description}
                                </p>

                                <div className="mb-4">
                                    <p className="text-gray-700">Color:</p>
                                    <div className="flex gap-2 mt-2">
                                        {selectedProduct.colors.map((color) => (
                                            <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)} 
                                                //set selected color to color
                                            className={`w-8 h-8 rounded-full border ${selectedColor === color? "border-4 border-black": "border-gray-300"}`} 
                                               // a few classes if the color is selected: the logic is:: if the color is seleceted set(make) the border 4 pixsles and the border's color black else set(make) the border gary 300 
                                            style={{backgroundColor: color.toLocaleLowerCase(), 
                                                //what is this function(toLocaleLowerCase)?? and here I also made a mistake of putting  c small letter instead of C capitil letter that's why the colors did not appear 
                                                filter: "brightness(0.5)",
                                            }}
                                            >

                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* sizes */}
                                <div className="mb-4">
                                    <p className="text-gray-700">Size:</p>
                                    <div className="flex gap-2 mt-2">
                                        {selectedProduct.sizes.map((size) => (
                                            <button 
                                            key={size} 
                                            onClick={() => setSelectedSize(size)} 
                                            className={`px-4 py-2 rounded border ${selectedSize === size ? "bg-black text-white" :   ""}`}
                                            // here is the logic of this code: if the size is selected make the background color balck and the text white esle do nothing cuz the "" are empty
                                             >
                                            {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Quantity: here we will work on quantity */}
                                <div className="mb-6">
                                    <p className="text-gray-700">Quantity:</p>
                                    <div className="flex  items-center space-x-4 mt-2 ">
                                        {/* a button for increment and decrement  */}
                                        <button 
                                        onClick={() => handleQuantityChange("minus")}
                                        className="px-2 py-1 bg-gray-200 roundded text-lg"
                                        >
                                            -
                                        </button>
                                        <span className="terxt-lg">{quantity}</span>
                                        <button 
                                        onClick={() => handleQuantityChange("plus")}
                                        className="px-2 py-1 bg-gray-200 roundded text-lg">
                                            +
                                        </button>
                                    </div> 
                                </div>
                                {/* a  butoon for add to cart */}
                                <button
                                onClick={handleAddToCart}
                                disabled={isButtonDisabled}
                                 className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                                    isButtonDisabled 
                                    ? "cursoe-not-allowed opacity-50 "
                                     : "hover:bg-gray-900"
                                } `}
                                >
                                   {isButtonDisabled ? "Adding...": "ADD TO CART"}
                                </button>

                                <div className="mt-10 text-gray-700">
                                    <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                                    <table className="w-full text-left text-sm text-gray-600">
                                        <tbody> 
                                            <tr>
                                                <td className="py-1">Brand</td>
                                                <td className="py-1">{selectedProduct.brand}</td>
                                            </tr>

                                            <tr>
                                                <td className="py-1">Material</td>
                                                <td className="py-1">{selectedProduct.material}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>


                            </div>
                    </div>
                    {/* You May like section  :::: this section displays products similar to Best Selling Products*/}
                    <div className="mt-20">
                        <h2 className="text-2xl text-center font-medium mb-4">
                            You May Also Like
                        </h2>
                    </div>
                    <ProductGrid  products={similarProducts} loading={loading} error={error}/>

                </div>
        )}
        </div>
    );
};
export default productDetails;