import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";



const NewArrivals = () => { 
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    /* this will be the starting value of x-axis whrn user grabs and scrolls the conatiner */ 
    const [stratX, setStartX] = useState(0);
    /* add a contant scroll left this will bew the inital scroll position of the container */
    const [scrollLeft, setScrollLeft] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    /* add a constant can scroll right to determine if the container can be scrolled to the right */
    const [canScrollRight, setCanScrollright] = useState(true);
    /* we will need to crate a dummy products to display in this section*/
    
     const  [newArrivals, setNewArrivals] = useState([]);
     useEffect(() => {
        const fetchArrivals = async () => {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
                    );
                    setNewArrivals(response.data)
                } catch (error) {
                    console.error(error)
                }
        };

        fetchArrivals();

     }, [])
    /*  */
    const handleMouseDown = (e) => {
        setIsDragging(true) /* indicating that the user can scroll the conetent */
        setStartX(e.pageX - scrollRef.current.offsetLeft); /*  */
        setScrollLeft(scrollRef.current.scrollLeft); /* These values are needed when the user will move the mouse horizontally to set the position of the conatiner */
    }
    const handleMouseMove = (e) => {
        if(!isDragging)  return;
        const x = e.pageX -scrollRef.current.offsetLeft;
        const walk = x - StartX;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    }
    const handleMouseUpOrLeave = () => {
        setIsDragging(false)
    }

    /* this function will be called when the left or right icons are clicked */
    const scroll = (direction) => {
        const scrollAmount = direction === "left" ? -300 : 300;
        scrollRef.current.scrollBy({left: scrollAmount, behaviour: "smooth"});
    };

    //Update Scroll Buttons
    const updateScrollButtons = () => {
        const conatiner = scrollRef.current;

        if(conatiner) {
            const leftScroll = conatiner.scrollLeft; // this constant holds the scroll left value

            setCanScrollLeft(leftScroll > 0); // in this code it means that allow the user to scroll if the vlaue of the scroll left is greater than zero

        }
    }


    useEffect(() => {
        const container  = scrollRef.current;
        if(container){
            container.addEventListener("scroll", updateScrollButtons);
            /* let's invoke the function on the page laod */
            updateScrollButtons();
            return() => container.removeEventListener("scroll", updateScrollButtons); //what is (updateScrollButtons) 
            //with this change we have completed the new arrival section
        }
    }, [newArrivals]); 

    return (
        <section className="py-16 px-4 lg:px-0" > {/* we added padding for it to look better at mobile */}
            <div className="conatiner mx-auto text-center mb-10 relative">
                <h2 className="text-3xl font-bold mb-4">
                    Explore New Arrivals
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    Discover the lastest styles straight  off the runway, freshly added to keep your wardrobe on the cutting edge of fashion.
                </p>
                {/* Scroll Buttons */}
                <div className="absolute  right-0 bottom-[-30px] flex space-x-2">
                    <button
                     onClick={ () => scroll("left")}
                     disabled={!canScrollLeft} 
                     className={`p-2 rounded border ${canScrollLeft ? "bg-white text-black" :"bg-gray-200 text-gray-400 cursror-not-allowed"}`}>
                        {/* this is the  left icon and its sty */}
                        <FiChevronLeft className="text-2xl" />
                    </button>
                    <button 
                    onClick={() => scroll("right") }
                    className={`p-2 rounded border ${canScrollRight ? "bg-white text-black" :"bg-gray-200 text-gray-400 cursror-not-allowed"}`}>
                        {/* this is the  left icon and its sty */}
                        <FiChevronRight className="text-2xl" />
                    </button>
                </div> 
            </div>
            {/* Scrollable content */}
            <div 
            ref={scrollRef}
             className={`conatiner mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            /* Events */
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            /* So with these events we can determine when the user will drag the content within the container */
            >
                {newArrivals.map((product) =>( 
                    <div key={product._id} className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative">
                        <img src={product.images[0]?.url} 
                        alt={product.images[0]?.altText || product.name}
                        className="w-full h-[500px] object-cover rouneded-lg"
                        draggable="false"
                         />
                         <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
                            <Link to={`/product/${product._id}`} className="block">
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="mt-1">${product.price}</p>
                            </Link>
                         </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
export default NewArrivals;