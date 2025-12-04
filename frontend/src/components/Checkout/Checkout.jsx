import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../CartContext/CartContex";

const Checkout = () => {
  const { totalAmount, cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <Link
            className="flex items-center gap-2 text-amber-400 mb-8"
            to="/cart"
          >
            <FaArrowLeft />
            Back to Cart
          </Link>
          <h1 className="text-4xl font-bold text-center mb-8">checkout</h1>
          <form className="grid lg:grid-cols-2 gap-12" onSubmit={handleSubmit}>
            <div className="bg-[#4b3b3b]/80 p-6 rounded-3xl space-y-6">
              <h2 className="text-2xl font-bold">Personal Information</h2>
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
              <Input
                label="Zip Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
