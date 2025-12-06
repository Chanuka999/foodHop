import React, { useState } from "react";
import { useCart } from "../../CartContext/CartContex";
import { Link } from "react-router-dom";
import { FaMinus, FaPlus, FaTimes, FaTrash } from "react-icons/fa";

const API_URL = "http://localhost:4000";

const CartPage = () => {
  const {
    cartItems = [],
    updateQuantity,
    removeFromCart,
    totalAmount,
  } = useCart();

  const [selectedImage, setSelectedImage] = useState(null);

  const buildImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    // If path refers to uploads (backend), ensure full URL
    if (path.includes("/uploads/") || path.startsWith("uploads/")) {
      return `${API_URL}/${path.replace(/^\/+/, "")}`;
    }
    // If path is an absolute path served by the frontend (starts with '/'), return as-is
    if (path.startsWith("/")) return path;
    // Otherwise return path as-is (likely a Vite asset import)
    return path;
  };

  return (
    <div className="min-h-screen overflow-x-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a120b] via-[#3c2a21] to-[#3e2b1d]">
      <div className="mex-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 animate-fade-in-down">
          <span className="font-dancingscript block text-3xl sm:text-6xl md:text-7xl mb-2 bg-gradient-to-r from-amber-100 to-amber-400 bg-clip-text text-transparent">
            Your Cart
          </span>
        </h1>
        {cartItems.length === 0 ? (
          <div className="text-center animate-fade-in">
            <p className="text-amber-100/80 text-xl mb-4">Your cart is empty</p>
            <Link
              to="/menu"
              className="transition-all duration-300 inline-flex items-center gap-2 hover:gap-3 hover:bg-amber-800/50 bg-amber-900/40 px-6 py-2 rounded-full font-cinzel uppercase"
            >
              Browser All Items
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cartItems.map((ci, idx) => {
                // Debug: log cart entry structure to help diagnose image issues
                if (idx === 0) console.log("CartPage first item:", ci);

                const _id = ci && (ci._id || ci.id);
                const cartId =
                  _id || (ci && ci.item && (ci.item._id || ci.item.id)) || null;

                // Normalize item: some cart entries are { item: { ... } },
                // others are the item object itself, or ci.item may be a string id.
                const item =
                  ci && typeof ci.item === "object"
                    ? ci.item
                    : ci && ci.item
                    ? { _id: ci.item }
                    : ci && ci.name
                    ? ci
                    : {};

                const quantity = ci && ci.quantity ? ci.quantity : 0;

                // Try several possible image fields (populated from backend or local assets)
                const candidateImage =
                  // direct fields on the cart entry
                  ci?.image ||
                  ci?.imageUrl ||
                  // top-level item fields
                  item?.imageUrl ||
                  item?.image ||
                  // some data shapes may nest item again
                  item?.item?.imageUrl ||
                  item?.item?.image ||
                  // fallback to first image in an images array
                  (item?.images && item.images.length
                    ? item.images[0]
                    : null) ||
                  null;

                const imageSrc = candidateImage
                  ? buildImageUrl(candidateImage)
                  : null;
                const placeholder =
                  "data:image/svg+xml;utf8," +
                  encodeURIComponent(
                    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%233a2b20'/><text x='50%' y='50%' fill='%23f5e0b7' font-size='20' font-family='Arial' dominant-baseline='middle' text-anchor='middle'>No image</text></svg>`
                  );
                const key = _id || item._id || item.id || `ci-${idx}`;

                return (
                  <div
                    key={key}
                    className="group bg-amber-900/20 p-4 rounded-2xl border-4 border-dashed border-amber-500 backdrop-blur-sm flex flex-col items-center gap-4 transition-all duration-300 hover:border-solid hover:shadow-xl hover:shadow-amber-900/10 transform hover:-translate-y-1 animate-fade-in"
                  >
                    <div
                      className="w-24 h-24 flex-shrink-0 cursor-pointer relative overflow-hidden rounded-lg transition-transform duration-300"
                      onClick={() => setSelectedImage(imageSrc)}
                    >
                      <img
                        src={imageSrc || placeholder}
                        alt={item?.name || "item"}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="w-full text-center">
                      <h3 className="text-xl font-dancingscript text-amber-100">
                        {item?.name || "Unnamed item"}
                      </h3>
                      <p className="text-amber-100/80 font-cinzel mt-1">
                        ${Number(item?.price ?? 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (!cartId)
                            return console.warn(
                              "CartPage: missing cartId for update",
                              ci
                            );
                          updateQuantity(cartId, Math.max(1, quantity - 1));
                        }}
                        className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-100/50 transition-all duration-200 active-scale-95"
                      >
                        <FaMinus className="w-4 text-amber-100" />
                      </button>
                      <span className="w-8 text-center text-amber-100 font-cinzel">
                        {quantity}
                      </span>
                      <button
                        onClick={() => {
                          if (!cartId)
                            return console.warn(
                              "CartPage: missing cartId for update",
                              ci
                            );
                          updateQuantity(cartId, quantity + 1);
                        }}
                        className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-100/50 transition-all duration-200 active-scale-95"
                      >
                        <FaPlus className="w-4 text-amber-100" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            if (!cartId)
                              return console.warn(
                                "CartPage: missing cartId for remove",
                                ci
                              );
                            removeFromCart(cartId);
                          }}
                          className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-100/50 transition-all duration-200 active-scale-95"
                          aria-label="Remove item"
                        >
                          <FaTrash className="w-4 text-amber-100" />
                        </button>
                        <span className="text-sm font-dancingscript text-amber-300">
                          LKR{Number(item.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center "></div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 pt-8 border-amber-500/30 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                <Link
                  to="/menu"
                  className="bg-amber-900/40 px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:bg-amber-800/10 transition-all duration-300 text-amber-100 inline-flex items-center gap-2 hover:gap-3 active:scale-95"
                >
                  Continue Shopping
                </Link>

                <div className="flex items-center gap-8">
                  <h2 className="text-3xl font-dancingscript text-amber-100">
                    Total: LKR{Number(totalAmount).toFixed(2)}
                  </h2>
                  <Link
                    to="/checkout"
                    className="bg-amber-900/40 px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:bg-amber-800/10 transition-all duration-300 text-amber-100 flex items-center gap-2 hover:gap-3 active:scale-95"
                  >
                    Checkut now
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-amber-900/40 bg-opacity-75 backdrop: p-4 overflow-auto"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full view"
            className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-1 right-1 bg-amber-900/10 rounded-full p-2 text-black hover:bg-amber-500/90 transition-transform duration-300 active:scale-90"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
