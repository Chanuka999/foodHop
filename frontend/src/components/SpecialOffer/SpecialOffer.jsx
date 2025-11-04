import React, { useState } from "react";
import { cardData, additionalData } from "../../assets/dummydata";
import { useCart } from "../../CartContext/CartContex";

const SpecialOffer = () => {
  const [showAll, setShowAll] = useState(false);
  const initialData = [...cardData, ...additionalData];
  const { cartItems = [] } = useCart();
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
          {(showAll ? initialData : initialData.slice(0, 4)).map(
            (item, index) => {
              const cartItem = cartItems.find((ci) => ci.id == item.id);
              const quantity = cartItem ? cartItem.quantity : 0;

              return (
                <div
                  key={`${item.id}-${index}`}
                  className="relative group bg-[#4b3b3b] rounded-3xl overflow-hidden shadow-2xl transform hover:-translate-y-4 transition-all duration-500 hover:shadow-red-900/40 border-2 border-transparent hover:border-amber-500/20 before:absolute before:inset-0 hover:before:opacity-20"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-500"
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
