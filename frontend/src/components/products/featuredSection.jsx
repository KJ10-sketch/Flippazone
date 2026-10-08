import { HiShoppingBag } from 'react-icons/hi'; // Import from Heroicons set
import { HiArrowPathRoundedSquare, HiOutlineCreditCard } from 'react-icons/hi2';
const featuredSection = () => {
    return(
        /* this page is for features section where we add the features website   */

        
        <section className="py-16 px-4 bg-white">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {/* Feature 1  */}
                <div className="flex flex-col items-center">
                     {/* here I got an error where I should have put flex-col instead of felx-col that error made the texts appear beside each other not under each other */}
                    <div className="p-4 rounded-full mb-4">
                        <HiShoppingBag className="text-xl" />
                    </div>
                    <h4 className="tracking-tighter">FREE INTERNATIONAL SHIPPING</h4>
                    <p className=" text-gray-600 text-sm tracking-tighter">
                        On All Ordders Over $100.00
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col items-center">
                    <div className="p-4 rounded-full mb-4">
                        <HiArrowPathRoundedSquare className="text-xl" />
                    </div>
                    <h4 className="tracking-tighter">45 Days Return</h4>
                    <p className=" text-gray-600 text-sm tracking-tighter">
                        Money Back Guarantee
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col items-center">
                    <div className="p-4 rounded-full mb-4">
                        <HiOutlineCreditCard className="text-xl" />
                    </div>
                    <h4 className="tracking-tighter">SECURE CHECKOUT</h4>
                    <p className=" text-gray-600 text-sm tracking-tighter">
                        100% secured checkout process
                    </p>
                </div>
        </div>
        </section>    
    );
};
export default featuredSection;
