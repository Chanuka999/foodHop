import React, { useEffect, useState } from "react";
import { cardData, additionalData } from "../../assets/dummydata";
import { useCart } from "../../CartContext/CartContex";
import { FaFire, FaHeart, FaPlus, FaStar } from "react-icons/fa";
import { HiMinus, HiPlus } from "react-icons/hi";
import FloatingParticle from "../floatingParticle/FloatingParticle";
import axios from "axios";

const SpecialOffer = () => {
  const [showAll, setShowAll] = useState(false);
  const [items, setItems] = useState([]);
  const { addToCart, updateQuantity, removeFromCart, cartItems } = useCart();
  // Button style helpers (was missing and caused ReferenceError)

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/items")
      .then((res) => setItems(res.data.items ?? res.data))
      .catch((err) => console.error(err));
  }, []);

  const displayList = Array.isArray(items)
    ? items.slice(0, showAll ? 8 : 4)
    : [];

  const addButtonBase =
    "relative inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-900 rounded-full overflow-hidden font-semibold";
  const addButtonMove = "transform hover:scale-105";
  const commonTransition = "transition-all duration-300 ease-in-out";

  // helper to find cart entry for an item (handles populated item or raw id)
  const findCartItemFor = (item) =>
    cartItems.find((ci) => {
      if (!ci) return false;
      const itm = ci.item;
      if (!itm) return false;
      const itmId = typeof itm === "string" ? itm : itm._id || itm.id;
      const targetId = item._id || item.id;
      return String(itmId) === String(targetId);
    });

  // Safe add/update/remove helpers that call CartContext functions where available
  const safeAddToCart = (item, qty) => {
    if (typeof addToCart === "function")
      return addToCart({ ...item, _id: item._id || item.id }, qty);
  };

  const safeUpdateQuantity = (cartItemId, qty) => {
    if (typeof updateQuantity === "function")
      return updateQuantity(cartItemId, qty);
  };
  return (
    <div className="bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4 font-[Poppins]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold mb-4 transform transition-all bg-gradient-to-r from-amber-400 text-red-500 bg-clip-text text-transparent font-[Playfair_Display] italic">
            Today's <span className="text-stroke">Special</span> Offers
          </h1>

          <p className="text-lg text-gray-100 max-w-3xl mx-auto tracking-wide leading-relaxed">
            Save the extraordinary with our culinary masterprincess crafted to
            perfection
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displayList.map((item, index) => {
            const cartItem = cartItems.find((ci) => {
              if (!ci) return false;
              const itm = ci.item;
              if (!itm) return false;
              const itmId = typeof itm === "string" ? itm : itm._id || itm.id;
              const targetId = item._id || item.id;
              return String(itmId) === String(targetId);
            });
            const qty = cartItem ? cartItem.quantity : 0;

            const cartId = cartItem?._id;

            return (
              <div
                key={item._id}
                className="relative group bg-[#4b3b3b] rounded-3xl overflow-hidden shadow-2xl transform hover:-translate-y-4 transition-all duration-500 hover:shadow-red-900/40 border-2 border-transparent hover:border-amber-500/20 before:absolute before:inset-0 hover:before:opacity-20"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-500"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="flex items-center gap-2 text-amber-400">
                      <FaStar className="text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
                      <span className="font-bold">{item.rating}</span>
                    </span>
                    <span className="flex items-center gap-2 text-red-400">
                      <FaHeart className="text-xl animate-heartbeat" />
                      <span className="font-bold">{item.hearts}</span>
                    </span>
                  </div>
                </div>

                <div className="p-6 relative z-10">
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent font-[Playfair_Display] italic">
                    {item.name}
                  </h3>
                  <p className="text-gray-300 mb-5 text-sm leading-relaxed tracking-wide">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-2xl font-bold text-amber-400 flex-1">
                      LKR{Number(item.price).toFixed(2)}
                    </span>

                    {qty > 0 ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            qty > 1
                              ? updateQuantity(cartId, qty - 1)
                              : removeFromCart(cartId);
                          }}
                          className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition-all duration-200 active:scale-95 "
                        >
                          <HiMinus className="w-4 h-4 text-amber-100" />
                        </button>
                        <span className="w-8 text-center text-amber-100 font-cinzel">
                          {qty}
                        </span>
                        <button
                          onClick={() => {
                            updateQuantity(cartId, qty + 1);
                          }}
                          className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition-all duration-200 active:scale-95 "
                        >
                          <HiPlus className="w-4 h-4 text-amber-100" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          addToCart({ ...item, _id: item._id || item.id }, 1)
                        }
                        className={`${addButtonBase} ${addButtonMove} ${commonTransition}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        <FaPlus className="text-lg transition-transform" />
                        <span className="relative z-10">Add</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-transparent group-hover:border-amber-500/30 transition-all duration-500" />
                <div className="opacity-0 group-hover:opacity-100">
                  <FloatingParticle />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-3 bg-gradient-to-r from-red-700 to-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-lg uppercase tracking-wider hover:gap-4 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 group border-2 border-amber-400 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r fill-amber-500/20 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <FaFire className="text-xl animate-pulse" />
            <span>{showAll ? "Show less" : "Show More"}</span>
            <div className="h-full w-1 bg-amber-400/30 absolute right-0 top-0 group-hover:animate-border-pulse"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
