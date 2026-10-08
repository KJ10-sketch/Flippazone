/* 

now if I refresh the page, te filter section dose not retain the previous selected options so we added the following:
1-  checked={filters.category === category} NOW what does this code do is: first we added the check attributes and xheck if the filters categories equal to current category} we added this to the oter filters input tags.
2- In the color filter secction we added this code ((  ${filters.color === color ?  "ring-2 ring-blue-500" : ""}     )) Instead of adding the code on NUMBER ONE and the logic of the code is:
if filters.color is equla to color add class ring-3 and class ring-blue-500 if else do nothing "" 
3-For the Sizes  we added this code (    checked={filters.size.includes(size)}      ) to check if the current size is present in the area of sizes. AND the same code does to the material and brands

 */











import { useState  } from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {

    /* THIS IDEA IS FO THE FUTURE: I want to add a VIP section for the products I will sell on the website whatever the nich is wheather it is for one niche or multiple niches */

    /* we are going to declare a state variable to read and modify the query parameters */
    const [searchParams, setSearchParams] = useSearchParams();
    //c.com/?a=1&b=2

    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        category: "",
        gender: "",
        color: "",
        //the size will be an array cuz it can have multiple value
        size: [],
        //the materials will be an array cuz it can have multiple value
        materials: [],
        //the brand will be an array cuz it can have multiple value
        brand: [],
        // here we have the price range which will have maximun and minimum values
        minPrice: 0,
        maxPrice: 100,
    });
    /* here I will declare a price range to work with */
    const [priceRange, setPriceRange] = useState([0,100]);

    /* to display the itmes that you see on the filter sidebar we have to deaclare a few variables we can store them on the database but in this course the foucs of the tutorila is on the functionality part  */
    const categories = ["Top Wear", "Bottom Wear"];
    const colors =[
        //Here I can add as many colors as I want
        //I can make more styles of colors like colors pallete we see on Pinterst and get inspiered from
        "red",
        "Blue",
        "Black",
        "Green",
        "Yellow",
        "Gray",
        "White",
        "Pink",
        "Beige",
        "Navy",
    ];
    const sizes = ["XS","S","M","L","XL","XXl"];
    const materials = [
        "Cotton",
        "Wool",
        "Denim",
        "Polyester",
        "Silk", // I will not add this section cuz the website is for a muslim owner if I want to really add it I need to keep it only for women
        "Linen",
        "Viscose",
        "Fleece",
    ];
    const brands = [
        // Fotr this we need to add the brands according to the country I will sell for

        /* I want to add the following brands names:
        1- Ice Cube
        2- Magilla
        3-MyJeans
        4-Eva
        5-Eva

        */
        "Ice Cubes",
        "Magilla",
        "MyJeans",
        "Eva",
        "Four hundrad",
        "Khalifa brand",

    ];
    //I do not know where should I add the baby catagory 🤣 Is it here on the gender section or where🤣🤣
    const genders = ["Men", "Women"];
    useEffect(() => {
         
         const params = Object.fromEntries([...searchParams]); //const params = Object.formEntries([...searchParams]); //this code was an error
         setFilters({
            category: params.category || "",
            gender: params.gender || "",
            color: params.color || "",
            size: params.size? params.size.split(",") :[],
            materials: params.materials? params.materials.split(",") :[],
            brand: params.brand? params.brand.split(",") :[],
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 100,
         });
         setPriceRange([0, params.maxPrice || 100])
    }, [searchParams]);

    /* this function will handle the change values of the filter */
    const handleFilterChange = (e) => {
        const {name, value, checked,  type} = e.target;     // ❌ "value" was misspelled
        
        /* console.log({name, value, checked, type}) */
            let newFilters = {...filters};

            if(type ===  "checkbox"){
                if(checked) {
                    newFilters[name] = [...(newFilters[name] ||  [ ]), value]
                } else{
                    newFilters[name] = newFilters[name].filter((item) => item !== value);
                }
            } else{
                newFilters[name] =value;
            }
            setFilters(newFilters);
              //Here I shouls call the update  function  (updateURLParams) in the handle filter
            updateURLParams(newFilters);
    }


    /* Function for  */
    const updateURLParams = (newFilters) => {
        const params =  new URLSearchParams();
        /* Now Our new Filters will contain the JavaScript object with data similar to this */
        // {categoy: "Top Wear", size:["XS","S"]
        //let's look through each key of the new filters
        Object.keys(newFilters).forEach((key) =>{
            if(Array.isArray(newFilters[key]) && newFilters[key].length > 0){
                 params.append(key, newFilters[key].join(",")); //  So basically we have two sizes in the size key: so it will look like sth like this:: "XS,S"
            }else if (newFilters[key]){
                params.append(key, newFilters[key])
            }
        });
        setSearchParams(params);
        navigate(`?${params.toString()}`);
         // the values will be sth like this: ?category=Bottom+Wear&size=XS%2CS
         // here 2%CS  :: theencoded version of comma 

    };

    // add a function to handle price change
    const handlePriceChange = (e) => {
        const newPrice = e.target.value;
        setPriceRange([0, newPrice])
        const newFilters = {...filters, minPrice: 0, maxPrice: newPrice};
        // here set filters to reflect the price range
        setFilters(newFilters);
        // and also update the URL
        updateURLParams(newFilters);
    };


    return(

        <div className="p-4">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>

            {/* Category Filter */}
            <div className="mb-6">
                <label className=" block text-gray-600 font-medium mb-2">Category</label>
                {categories.map((category) => (
                    <div key={category} className="flex items-center mb-1"> 
                    <input 
                    type="radio" 
                    name="category" 
                    value={category}
                    onChange={handleFilterChange}
                    checked={filters.category === category}
                    className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400  border-gray-500 "
                     />
                    <span className="text-gray-700">{category}</span>
                    </div>
                ))}
            </div>

            {/* Gender Filter */}
            <div className="mb-6">
                <label className=" block text-gray-600 font-medium mb-2">Gender</label>
                {genders.map((gender) => (
                    <div key={gender} className="flex items-center mb-1"> 
                    <input 
                    type="radio" 
                    name="gender" 
                    value={gender}
                    onChange={handleFilterChange}
                    checked={filters.gender === gender}
                    className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400  border-gray-500 "
                     />
                    <span className="text-gray-700">{gender}</span>
                    </div>
                ))}
            </div>  

            {/* Color Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Color</label>
                <div className="flex  flex-wrap gap-2">
                    {colors.map((color) => (
                        <button 
                         key={color} 
                         name="color"
                         value={color}
                          onClick={handleFilterChange} 
                         className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${filters.color === color ?  "ring-2 ring-blue-500" : ""}`} 
                         style={{backgroundColor: color.toLowerCase()}}
                         >

                        </button>
                    ))}
                </div>
            </div>


            {/* Size filter   ::::: with this we have size option where you can select multiple options  */}

            <div className="mb-6">
                <label className="block text-gray-600  font-medium mb-2">Size</label>
                       {/* this code is for looking for Sizes */}
                    {sizes.map((size) => (
                        <div key={size} className="flex items-center mb-1">
                            <input
                             type="checkbox" 
                             name="size" 
                             value={size}
                              onChange={handleFilterChange}
                              checked={filters.size.includes(size)} 

                             className="mr-2 h-5 w-5 text-blue-500 focus:ring-blue-500 border-x-gray-300" 
                             />
                            {/* for the input tag I changed h-2 to h-5 and w-2 to w-5 cuz they were so small */}
                            <span className="text-gray-700">{size}</span>
                        </div>
                    ))}
             </div>


             {/* Material filter */}

            <div className="mb-6">
                <label className="block text-gray-600  font-medium mb-2">Materials</label>
                       
                    {materials.map((material) => (
                        <div key={material} className="flex items-center mb-1">
                            <input 
                            type="checkbox"
                             name="materials" 
                             value={material}
                              onChange={handleFilterChange}
                                 checked={filters.materials.includes(material)} 

                             className="mr-2 h-5 w-5 text-blue-500 focus:ring-blue-500 border-x-gray-300"
                              />
                           
                            <span className="text-gray-700">{material}</span>
                        </div>
                    ))}
             </div>


             {/* Brand filter */}

            <div className="mb-6">
                <label className="block text-gray-600  font-medium mb-2">Brands</label>
                       
                    {brands.map((brand) => (
                        <div key={brand} className="flex items-center mb-1">
                            <input 
                            type="checkbox" 
                            name="brand" 
                            value={brand}
                            onChange={handleFilterChange}
                             checked={filters.brand.includes(brand)} 

                            className="mr-2 h-5 w-5 text-blue-500 focus:ring-blue-500 border-x-gray-300"
                             />
                           
                            <span className="text-gray-700">{brand}</span>
                        </div>
                    ))}
             </div>


             {/* Price Range Filter */}
                                  
                     {/* I want to add a color before the circle on Price Range ball this is FOR LATER UPDATING myself */}
             <div className="mb-8">
                <label className="block text-gray-600 font-medium mb-2">
                    Price Range
                </label>
                <input 
                  type="range"
                  name="priceRange"
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  min={0} 
                  max={100} 
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                   />
                   <div className="flex justify-between text-gray-600 mt-2">
                    <span>$0</span>
                    <span>${priceRange[1]}</span>
                   </div>
             </div>

             
        </div>
    )
};
export default FilterSidebar;