import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import Result from "./pages/Result";
import BuyCredit from "./pages/BuyCredit";
import Auth from "./pages/Auth";
import OtpVerification from "./pages/OtpVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { NavBar } from "./components/NavBar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <div className="px-4 sm:px-10 md:px-18 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50">
      <ToastContainer
        position="bottom-right"
        autoClose={5000} // close after 5 seconds
        hideProgressBar={false} // show progress bar
        closeOnClick={true} // close on click
      />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/otp-verification/:email" element={<OtpVerification />} />
        <Route path="/forgot/password" element={<ForgotPassword />} />
        <Route path="/forgot/reset/:token" element={<ResetPassword />} /> 
        <Route
          path="/buy"
          element={
            <PrivateRoute>
              <BuyCredit />
            </PrivateRoute>
          }
        />
        <Route
          path="/result"
          element={
            <PrivateRoute>
              <Result />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
