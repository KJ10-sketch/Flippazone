import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaStore, FaUser } from "react-icons/fa";
import { FaBoxOpen, FaClipboardList } from "react-icons/fa6";
import { useDispatch } from "react-redux";
const AdminSidebar = () => {

    // we will make the use naviagate hook
    const navigate  = useNavigate ();
    const dispatch = useDispatch();
    // we decalred the handleLogout and we called it aganin the button of line 69 
    const handleLogout =  () => {
        dispatch(logout());
        dispatch(clearCart());
        //for now let is just navigate to the home page
        navigate("/");

    }
    return(
        <div className="p-6">
            <div className="m-6">
                <Link to="/admin" className="text-1xl font-medium">Flippazone</Link>
            </div>
            <h2 className="text-xl font-medium mb-6 text-center">Admin Dashboard</h2>
        
             <nav className="flex flex-col space-y-2">
                <NavLink 
                  to="/admin/users" 
                  className={({isActive}) =>
                  isActive 
                  ? "bg-gray-700 text-white  py-3 px-4 rounded flex items-center space-x2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
                 }
                >
                 <FaUser />
                 <span>Users</span>
                </NavLink>

                <NavLink 
                  to="/admin/products" 
                  className={({isActive}) =>
                  isActive 
                  ? "bg-gray-700 text-white  py-3 px-4 rounded flex items-center space-x2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
                 }
                >
                 <FaBoxOpen />
                 <span>Products</span>
                </NavLink>

                <NavLink 
                  to="/admin/orders" 
                  className={({isActive}) =>
                  isActive 
                  ? "bg-gray-700 text-white  py-3 px-4 rounded flex items-center space-x2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
                 }
                >
                 <FaClipboardList />
                 <span>Orders</span>
                </NavLink>

                <NavLink   //this icpn will be for shop
                  to="/" 
                  className={({isActive}) =>
                  isActive 
                  ? "bg-gray-700 text-white  py-3 px-4 rounded flex items-center space-x2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
                 }
                >
                 <FaStore />
                 <span>Shop</span>
                </NavLink>  
            </nav> 

            {/* This div will be for the button */}
            <div className="mt-6">
                <button onClick={handleLogout} className="w-full  bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2"
                >
                    <FaSignOutAlt/>
                    <span>Logout</span>
                 </button>
            </div>
        </div>
    )
};
export default AdminSidebar;