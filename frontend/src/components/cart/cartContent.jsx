import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItemQuantity, removeFromCart } from "../../redux/slices/cartSlice";


const cartContent = ({cart, userId, guestId}) => {
    const dispatch = useDispatch();

    // Handle adding or substracting to cart
    const handleAddToCart = (productId, delta, quantity, size, color) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1) {
            dispatch(
                updateCartItemQuantity({
                    productId,
                    quantity: newQuantity,
                    guestId,
                    userId,
                    size,
                    color,
                })
            );
        }
    };

    const handleRemoveFromCart = (productId, size, color) => {
       dispatch(removeFromCart({ productId, guestId, userId, size, color }));
    };
        /* Since we haev not implemented the  backend yet
    let's hardcode some values for the cart items  */
    return(
        <div>
            {
                cart.products.map((product, index) => (
                    <div key={index} className="flex items-start justify-between py-4 border-b"> 
                    <div className="flex items-start">
                        <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-20 h-24 object-cover mr-4 rounded"/>
                        <div>
                            <h3>{product.name}</h3>
                            <p className="text-sm text-gary-500">
                                size: {product.size} | color: {product.color}
                            </p>
                                    {/* this div is for icrement and dectrement button  */}
                                    <div className="flex items-center mt-2 ">
                                        {/* minus sign */}
                                        <button 
                                         onClick={() => 
                                        handleAddToCart(
                                            product.productId,  
                                            -1,
                                             product.quantity, 
                                            product.size, 
                                            product.color
                                        )} 
                                        className=" border rounded px-2 py-1 text-xl font-medium">
                                            -
                                        </button>
                                        {/* Between the two button we will disply the product quantity */}
                                        <span className="mx-4">{product.quantity}</span>
                                        {/* plus sign  */}
                                        <button 
                                        onClick={() => 
                                        handleAddToCart(
                                            product.productId,  
                                            1,
                                             product.quantity, 
                                            product.size, 
                                            product.color
                                        )} 
                                        className="border rounded px-2 py-1 text-xl font-medium">
                                            +
                                        </button>
                                    </div>
                        </div>
                    </div>
                    {/* this div is to dispay the prduct price */}
                    <div className="">
                        <p>${product.price.toLocaleString()}</p>
                        <button 
                         onClick={() =>
                         handleRemoveFromCart(
                            product.productId,
                             product.size, 
                             product.color
                             )}
                        >
                            <RiDeleteBin3Line  className="h-6 w-6 mt-2 text-red-600 "/>
                        </button>
                    </div>
                    </div>
                ))
            }
        </div>
    );
};
export default cartContent;