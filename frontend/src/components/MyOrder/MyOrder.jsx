import React, { useEffect, useState } from "react";
import {
  FiArrowDownLeft,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoding] = useState(true);
  const [error, setError] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());

  const API_URL = "http://localhost:4000";

  // Helper to build image URLs consistently
  const buildImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    // If path refers to uploads (backend), ensure full URL
    if (path.includes("/uploads/") || path.startsWith("uploads/")) {
      return `${API_URL}/${path.replace(/^\/+/, "")}`;
    }
    // If path is an absolute path served by the frontend (starts with '/'), return as-is
    if (path.startsWith("/")) return `${API_URL}${path}`;
    // Otherwise return path as-is (likely a Vite asset import)
    return path;
  };

  const handleImageError = (imageUrl) => {
    setFailedImages((prev) => new Set([...prev, imageUrl]));
  };

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch orders and items in parallel. Orders may not include imageUrl
        // (older schema). Use catalog items to lookup images by name when missing.
        const [ordersRes, itemsRes] = await Promise.all([
          axios.get("http://localhost:4000/api/orders", {
            params: { email: user?.email },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
          axios.get("http://localhost:4000/api/items"),
        ]);

        const itemsList = Array.isArray(itemsRes.data) ? itemsRes.data : [];
        const itemsByName = itemsList.reduce((acc, it) => {
          if (it?.name) acc[it.name.toLowerCase()] = it;
          return acc;
        }, {});

        const formattedOrders = ordersRes.data.map((order) => ({
          ...order,
          items:
            (order.items || []).map((entry) => {
              const name = entry?.item?.name || "";
              const catalogItem = itemsByName[name.toLowerCase()];
              // Prefer imageUrl on the order entry, otherwise use catalog lookup
              const resolvedImage =
                entry?.item?.imageUrl || catalogItem?.imageUrl || "";
              return {
                _id: entry._id,
                item: {
                  // keep existing stored fields
                  ...entry.item,
                  // add resolved imageUrl (may be empty)
                  imageUrl: resolvedImage,
                },
                quantity: entry.quantity,
              };
            }) || [],
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

        <div className="bg-[#4b3b3b]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-amber-500/20">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text">
            Order History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#3a2b2b]/50">
                <tr>
                  <th className="p-4 text-left text-amber-400">Order ID</th>
                  <th className="p-4 text-left text-amber-400">Customer</th>
                  <th className="p-4 text-left text-amber-400">Address</th>
                  <th className="p-4 text-left text-amber-400">Items</th>
                  <th className="p-4 text-left text-amber-400">Total Items</th>
                  <th className="p-4 text-left text-amber-400">Price</th>
                  <th className="p-4 text-left text-amber-400">Payment</th>
                  <th className="p-4 text-left text-amber-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const totalItems = order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );
                  const totalPrice =
                    order.total ??
                    order.items.reduce(
                      (sum, item) => sum + item.item.price * item.quantity,
                      0
                    );
                  const paymentMethod = getPaymentMethodDetails(
                    order.paymentMethod
                  );
                  const status =
                    statusStyles[order.status] || statusStyles.processing;
                  const paymentStatus =
                    statusStyles[order.paymentStatus] || statusStyles.pending;

                  return (
                    <tr
                      key={order._id}
                      className="border-b border-amber-500/20 hover:bg-[#3a2b2b]/30 transition-colors group"
                    >
                      <td className="p-4 text-amber-100 font-mono text-sm">
                        #{order._id?.slice(-8)}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-amber-400" />
                        </div>
                        <p className="text-amber-100">
                          {order.firstName}
                          {order.lastName}
                        </p>
                        <p className="text-sm text-amber-400/60">
                          {order.phone}
                        </p>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-amber-400" />
                          <div className="text-amber-100/80 text-sm max-w-[200px]">
                            {order.address},{order.city} - {order.zipCode}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-2">
                          {order.items.map((item, index) => {
                            const imageUrl = buildImageUrl(item.item.imageUrl);
                            const hasError = failedImages.has(imageUrl);
                            const placeholder =
                              "data:image/svg+xml;utf8," +
                              encodeURIComponent(
                                `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><rect width='100%' height='100%' fill='%233a2b20'/><text x='50%' y='50%' fill='%23f5e0b7' font-size='10' font-family='Arial' dominant-baseline='middle' text-anchor='middle'>IMG</text></svg>`
                              );
                            return (
                              <div
                                key={`${order._id}-${index}`}
                                className="flex items-center gap-3 p-2 bg-[#3a2b2b]/50 rounded-lg"
                              >
                                <img
                                  src={hasError ? placeholder : imageUrl}
                                  alt={item.item.name}
                                  className="w-10 h-10 object-cover rounded-lg"
                                  onError={() => handleImageError(imageUrl)}
                                />

                                <div className="flex-1">
                                  <span className="text-amber-100/80 text-sm block">
                                    {item.item.name}
                                  </span>
                                  <div className="flex items-center gap-2 text-xs text-amber-400/60">
                                    <span>LKR{item.item.price}</span>
                                    <span className="mx-1">&dot;</span>
                                    <span>x{item.quantity}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FiBox className="text-amber-400" />
                          <span className="text-amber-300 text-lg">
                            {totalItems}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-amber-300 text-lg">
                        LKR{totalPrice.toFixed(2)}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          <div
                            className={`${paymentMethod.class} px-3 py-1.5 rounded-lg border text-sm`}
                          >
                            {paymentMethod.label}
                          </div>
                          <div
                            className={`${paymentStatus.color} px-3 py-1.5 rounded-lg text-sm`}
                          >
                            {paymentStatus.icon}
                            <span>{paymentStatus.label}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`${status.color} text-xl`}>
                            {status.icon}
                          </span>
                          <span
                            className={`px-4 py-2 rounded-lg ${status.bg} ${status.color} border border-amber-500/20 text-sm`}
                          >
                            {status.label}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12 text-amber-100/60 text-xl">
              No order found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
