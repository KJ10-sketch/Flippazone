import Topbar  from "../layout/topbar"; 
/*do  not to import from common folder because it is not a common component it is a layout component */
import Navbar from "./navbar";

const Header = () => {
    return (
        <header className="border-b border-gray-200"> 
            {/* Topbar */}
            <Topbar />
            {/* navbar */}
            <Navbar />
            {/* cart drawer */}
        </header>
    )
};
export default Header;