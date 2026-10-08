import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6"; 
/* changed the icon from React Icons : https://react-icons.github.io/react-icons/search/#q=Twitter */

const Topbar = () => {
    return (
        <div className="bg-[#171e3e] text-white"> {/* I tried to change the color but did not work, I do nt know why, there was not any issue with cooding at all */}
            <div    className="container mx-auto flex justify-between items-center py-3 px-4">
                {/* this div id for the icons on the left */}
                <div className=" hidden md:flex  items-center space-x-4">

                    {/* Facebook */}
                    <a href="#" className="hover:text-gray-300">
                        <TbBrandMeta className="h-5 w-5"/>
                    </a>

                    {/* Instagram */}
                   <a href="#" className="hover:text-gray-300">
                        <IoLogoInstagram className="h-5 w-5"/>
                    </a>

                    {/* X */}
                     <a href="#" className="hover:text-gray-300">
                        <FaXTwitter  className="h-4 w-4"/> {/* I changed the sizr of X cuz it was bigger */}
                    </a> 



                    {/* LAter add more accounts like 1-pinterest, 2-Youtube... etc and more */}
                </div>
                {/* Here is the text in the middle */}
                <div className="text-sm text-center flex-grow">
                    <span>We Ship door to door - Fast and realaible shipping </span>
                </div>
                {/* tel number */}
                <div className="text-sm hidden md:block">

                    
                    <a href="tel:+1234567890" className="hover:text-gray-300">
                        +1 (234) 567-890
                    </a>
                </div>

            </div>
        </div>
    )
}
export default Topbar
