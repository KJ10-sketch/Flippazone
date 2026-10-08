import Header from '../common/header';
import Footer from '../common/footer';
import { Outlet } from 'react-router-dom';
const userlayout = () => {
    return (    
        <>

        {/* Header */}
        <Header />
        {/* Mian content */}
       <main>
        <Outlet/>
       </main>
        {/* footer */}  
        <Footer />

        </>


    )
}
export default userlayout