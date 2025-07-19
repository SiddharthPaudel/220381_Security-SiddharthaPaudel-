import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import HomePage from "./Homepage/HomePage";
import Product from "./Product/Product";
import "./index.css";
import ProductDetails from "./Product Details/ProductDetails";
import MangaReader from "./MangaReader/MangaReader";
import Signup from "./SignUp/SignUp";
import Login from "./Login/Login";
import Bookmark from "./Bookmark/Bookmark";
import RentPage from "./Rent/RentPage";
import UpdateProfile from "./Profile/UpdateProfile";
import RentDetails from "./RentDetails/RentDetails";
import AdminLayout from "./Admin/Layout/AdminLayout";
import Dashboard from "./Admin/Dashboard/AdminDashboard";
import AddManga from "./Admin/AddManga/AddManga";
import AddChapter from "./Admin/AddChapter/AddChapter";
import UserTable from "./Admin/UserTable/UserTable";
import RentalTable from "./Admin/Rental/RentalTable";
import MangaTable from "./Admin/Manga/MangaTable";
import ProtectedAdminRoute from "./utils/ProtectedAdminRoutes";
import Unauthorized from "./utils/Unauthorize";
import ForgotPassword from "./ForgetPassword/ForgetPassword";
import ResetPassword from "./ResetPassword/ResetPassword";

import { Toaster } from 'react-hot-toast';
import PaymentSuccess from "./Payment/PaymentSucess";
import SupportPage from "./components/SupportPage";


function App() {
  return (
    <Router>
      <Routes>
                  <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<Product />} />
          <Route path="/manga/:id" element={<ProductDetails />} />
         <Route path="/manga/:id/read" element={<MangaReader />} />
          <Route path="signUp" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/rent" element={<RentPage />} />
          <Route path="/updateProfile" element={<UpdateProfile />} />
          <Route path="/rentDetails" element={<RentDetails />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/payment-success" element={<PaymentSuccess/>} />
          <Route path="/support" element={<SupportPage/>} />
        </Route>

        <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }>
          <Route index element={<Dashboard />} />
          <Route path="addmanga" element={<AddManga />} />
          <Route path="addchapter" element={<AddChapter />} />
          <Route path="rental" element={<RentalTable/>} />
          <Route path="manga" element={<MangaTable/>} />
          <Route path="usertable" element={<UserTable/>} />

        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
       
    </Router>
  );
}

export default App;
