import React, { useEffect, useState } from "react";
import { FiArrowDownLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoding] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/orders", {
          params: { email: user?.email },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const formattedOrders = response.data.map((order) => ({
          ...order,
          items:
            order.items?.map((entry) => ({
              _id: entry._id,
              item: {
                ...entry.item,
                imageUrl: entry.item.imageUrl, // <-- CORRECT: pull from entry.item
              },
              quantity: entry.quantity,
            })) || [],
          createdAt: new Date(order.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          paymentStatus: order.paymentStatus?.toLowerCase() || "pending",
        }));
        setOrders(formattedOrders);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load orders.please try again later"
        );
      } finally {
        setLoding(false);
      }
    };
    fetchOrders();
  }, [user?.email]);

  const statusStyles = {
    processing: {
      color: "text-amber-400",
      bg: "bg-amber-900/20",
      icon: <FiClock className="text-lg" />,
      label: "Processing",
    },
    outForDelivery: {
      color: "text-blue-400",
      bg: "bg-blue-900/20",
      icon: <FiTruck className="text-lg" />,
      label: "Out for Delivery",
    },
    delivered: {
      color: "text-green-400",
      bg: "bg-green-900/20",
      icon: <FiCheckCircle className="text-lg" />,
      label: "Delivered",
    },
    pending: {
      color: "text-yellow-400",
      bg: "bg-yellow-900/20",
      icon: <FiClock className="text-lg" />,
      label: "Payment Pending",
    },
    succeeded: {
      color: "text-green-400",
      bg: "bg-green-900/20",
      icon: <FiCheckCircle className="text-lg" />,
      label: "Completed",
    },
  };

  const getPaymentMethodDetails = (method) => {
    switch (method.toLowerCase()) {
      case "cod":
        return {
          label: "COD",
          class: "bg-yellow-600/30 text-yellow-300 border-yellow-500/50",
        };
      case "card":
        return {
          label: "Credit/Debit Card",
          class: "bg-blue-600/30 text-blue-300 border-blue-500/50",
        };
      case "upi":
        return {
          label: "UPI Payment",
          class: "bg-purple-600/30 text-purple-300 border-purple-500/50",
        };
      default:
        return {
          label: "Online",
          class: "bg-green-600/30 text-green-400 border-green-500/50",
        };
    }
  };

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e1e14] flex items-center justify-between text-xl gap-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-400"
        >
          <FiArrowLeft className="text-xl" />
          <span>Try again</span>
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300"
          >
            <FiArrowDownLeft className="text-xl" />
            <span className="font-bold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-amber-400/20 text-sm">{user?.email}</span>
          </div>
        </div>

        <div className="bg-[#4b3b3b]/80"></div>
      </div>
    </div>
  );
};

export default MyOrder;
