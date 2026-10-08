/* 
What this page will contain: I will add them when I implement everything from the video: 3:48:00
1- 
2-
3-
4-
5- Sort Options: the sort oprions contain three values (1- default 2- 3- 4- ) 
6- we ensure that the drawer closes if the user clicks outside.

 */


import {FaFilter} from "react-icons/fa";
import FilterSidebar  from "../components/products/filterSidebar";
import { useRef } from 'react';
import SortOptions from "../components/products/sortOptions";
import ProductGrid from "../components/products/productGrid";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { useParams, useSearchParams } from "react-router-dom";
import { fetchProductsByFilters } from "../redux/slices/productSlice";



 
const CollectionPage = () => 
{ /* here we add functions */
    const { collection } = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const queryParams = Object.fromEntries([...searchParams]);


    const  sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
    }, [dispatch, collection, searchParams]);


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const handleClickOutside = (e) => {
        // Close Sidebar If Clicked Outside 
        // adn the if conditional statemnet is for checking that the sidebar is loaded first
        // this part :: !sidebarRef.current.contain(e.target) :: means if the user clicks inside the sidebar do not close it
        if(sidebarRef.current && !sidebarRef.current.contains(e.target)){
            setIsSidebarOpen(false);
        }

    }
    useEffect(() => {
        // Add Event Lsitener for clicks
        document.addEventListener("mousedown", handleClickOutside);
        //Clean Event Lsitener
        return() => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
        
        
    }, []);

   

    return(
        <div className="flex flex-col lg:flex-row">
            {/* Mobile Filter  button */}
            <button 
             onClick={toggleSidebar} // add the toggleSidebar function to the button
             className="lg:hidden border p-2  flex justify-center items-center"
            >
                <FaFilter  className="mr-2"/>
            </button>

                {/* Filter Sidear  */}
                <div 
                  ref={sidebarRef} 
                  className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transfrom duration-300 lg:static lg:translate-x-0`}
                 >
                    <FilterSidebar />


                </div>

                <div className="flex-grow-0 p-4">
                    <h2 className="text-2xl uppercase mb-4">All Collection</h2>
                    
                    
                    {/* Sort Options */}
                    <SortOptions />


                     {/* Prduct Grid */}
                     <ProductGrid products={products} loading={loading} error={error} />    
                </div>
        </div>
    )
};
export default CollectionPage;