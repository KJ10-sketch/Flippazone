import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout  from "./components/layout/userlayout";
import Home from "./pages/home";
import  {Toaster} from "sonner";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import CollectionPage from "./pages/collectionPage";
import ProductDatails from "./components/products/productDetails";
import Checkout from "./components/cart/checkout";
import OrderConfirmationPage from "./pages/orderConfirmationPage";
import OrderDetails from "./pages/orderDetails";
import MyOrdersPage from "./pages/myOrdersPage";
import AdminLayout from "./components/admin/adminLayout";
import AdminHomepage from "./pages/adminHomePage";
import UserManagment from "./components/admin/usermanagmenet";
import ProductManagement from "./components/admin/productManagemnet";
import EditProductPage from "./components/admin/editProductPage";
import OrderManagement from "./components/admin/orderManagement";

import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/common/protectRoutes";



  function App() {
    return (
      <Provider store={store}>
        <BrowserRouter>
        <Toaster  position="top-right"/> {/* this is the Sonner */}
          <Routes>
            <Route path="/" element={<UserLayout  />}>
            <Route  index element={<Home />}/>
            <Route path="login" element={ <Login />} />
            <Route path="register" element={ <Register />} />
            <Route path="profile" element={ <Profile />} />
            <Route path="collection/:collection" element={ <CollectionPage />} />
            <Route path="product/:id" element={ <ProductDatails />} />
            <Route path="checkout" element={ <Checkout />} />
            <Route
              path="order-confirmation"
              element={ <OrderConfirmationPage />} 
              />
            <Route path="order/:id" element={ <OrderDetails />} />
            <Route path="my-orders" element={ <MyOrdersPage />} />

            </Route>
            <Route path="/admin" element={
               <ProtectedRoute role="admin">
                <AdminLayout /> 
                </ProtectedRoute>
               }
              >
              <Route index element={<AdminHomepage />} />
              <Route path="users" element={<UserManagment />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="products/:id/edit" element={<EditProductPage />} />
              <Route path="orders" element={<OrderManagement />} />




            </Route>
          </Routes>
        </BrowserRouter> 
      </Provider> 
    );
  }
export default App