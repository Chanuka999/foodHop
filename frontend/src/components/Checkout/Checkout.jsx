import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../CartContext/CartContex";
import axios from "axios";

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

  const token = localStorage.getItem("authToken");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get("payment_status");
    const sessionId = params.get("session_id");

    if (paymentStatus) {
      setLoading(true);

      if (paymentStatus === "success" && sessionId) {
        axios
          .post(
            "http://localhost:4000/api/orders/confirm",
            { sessionId },
            { headers: authHeaders }
          )
          .then(({ data }) => {
            clearCart();
            navigate("/myorder", { state: { order: data.order } });
          })
          .catch((err) => {
            console.error("payment confimation error : ", err);
            setError("payment confimation failed.please contact support");
          })
          .finally(() => setLoading(false));
      } else if (paymentStatus === "cancel") {
        setError("payment was cancelled or failed.please contact suppoer");
        setLoading(false);
      }
    }
  }, [location.search, clearCart, navigate, authHeaders]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = Number(totalAmount.toFixed(2));
  const tax = Number((subtotal * 0.05).toFixed(2));
  const buildPayload = () => ({
    ...formData,
    subtotal,
    tax,
    total: Number((subtotal + tax).toFixed(2)),
    items: cartItems.map((ci) => {
      const itm = ci.item || {};
      return {
        name: itm?.name || "Unnamed",
        price: Number(itm?.price ?? 0),
        quantity: ci.quantity || 0,
        imageUrl: itm?.imageUrl || itm?.image || "",
      };
    }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = buildPayload();

    try {
      if (formData.paymentMethod === "online") {
        const { data } = await axios.post(
          "http://localhost:4000/api/orders",
          payload,
          { headers: authHeaders }
        );
        window.location.href = data.checkoutUrl;
      } else {
        const { data } = await axios.post(
          "http://localhost:4000/api/orders",
          payload,
          { headers: authHeaders }
        );
        clearCart();
        navigate("/myorder", { state: { order: data.order } });
      }
    } catch (err) {
      console.error("Order submission error", err);
      setError(err.response?.data?.message || "Failed to submit order");
    } finally {
      setLoading(false);
    }
  };
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

            <div className="bg-[#4b3b3b]/80 p-6 rounded-3xl space-y-6">
              <h2 className="text-2xl font-bold">Payment Details</h2>

              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-amber-100">
                  Your Order Items
                </h3>

                {cartItems.map((ci, idx) => {
                  const _id = ci._id || ci.item?._id || `ci-${idx}`;
                  const item = ci.item || {};
                  const quantity = ci.quantity || 0;

                  return (
                    <div
                      key={_id}
                      className="flex justify-between items-center bg-[#3a2b2b] p-3 rounded-lg"
                    >
                      <div className="flex-1">
                        <span className="text-amber-100">
                          {item?.name || "Unnamed"}
                        </span>
                        <span className="ml-2 text-amber-500/80 text-sm">
                          {quantity}
                        </span>
                      </div>

                      <span className="text-amber-100">
                        LKR{(Number(item?.price ?? 0) * quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <PaymentSummry totalAmount={totalAmount} />

              <div>
                <label className="block mb-2">Payment method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#3a2b2b]/50 rounded-xl px-4 py-3"
                >
                  <option value="">Select Method</option>
                  <option value="cod">Cash on Delivary</option>
                  <option value="online">Online payment</option>
                </select>
              </div>

              {error && <p className="text-red-400 mt-2">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-amber-600 py-4 rounded-xl font-bold flex justify-center items-center"
              >
                <FaLock className="mr-2" />
                {loading ? "Proccessing..." : "Complete Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, type = "text", value, onChange }) => {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full bg-[#3a2b2b]/50 rounded-xl px-4 py-2"
      />
    </div>
  );
};

const PaymentSummry = ({ totalAmount }) => {
  const subtotal = Number(totalAmount.toFixed(2));
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  return (
    <div className="space-2">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>LKR{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-center">
        <span>Tax (5%):</span>
        <span>LKR{tax.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold border-t pt-2">
        <span>Total:</span>
        <span>LKR{total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Checkout;
