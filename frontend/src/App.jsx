import AboutPage from "./pages/AboutPage/AboutPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import Home from "./pages/Home/Home";
import { Route, Routes } from "react-router-dom";
import Menu from "./pages/Menu/Menu";
import Cart from "./pages/Cart/Cart";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import VerifyPaymentPage from "./pages/VerifyPaymentPage/VerifyPaymentPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/menu" element={<Menu />} />

      <Route path="/login" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/myorder/verify" element={<VerifyPaymentPage />} />

      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        }
      />
      <Route
        path="checkout"
        element={
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
