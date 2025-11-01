import React, { useState } from "react";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { GiChefToque } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import {
  FiBook,
  FiHome,
  FiPhone,
  FiShoppingCart,
  FiStar,
} from "react-icons/fi";
import { useCart } from "../../CartContext/CartContex";

const Navbar = () => {
  const [isOpen, setIsOpne] = useState(false);
  const { totalItems } = useCart();

  const navLinks = [
    { name: "Home", to: "/", icon: <FiHome /> },
    { name: "Menu", to: "/menu", icon: <FiBook /> },
    { name: "About", to: "/about", icon: <FiStar /> },
    { name: "Contact", to: "/contact", icon: <FiPhone /> },
  ];

  return (
    <nav className="bg-[#2D1B0E] border-b-8 border-amber-900/30 shadow-amber-900/30 sticky top-0 z-50 shadow-[0_25px_50px_-12px] font-vibes group/nav overflow-hidden">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">
        <div className="h-[6px] bg-gradient-to-r from-transparent via-amber-600/50 to-transparent shadow-[0_0_20px] shadow-amber-500/30">
          <div className="flex justify-between px-6">
            <GiForkKnifeSpoon
              className="text-amber-500/40 -mt-4 -ml-4 rotate-45"
              size={32}
            />
            <GiForkKnifeSpoon
              className="text-amber-500/40 -mt-4 -mr-2 -rotate-45"
              size={32}
            />
          </div>
        </div>
      </div>

      {/*main navigation content*/}
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex justify-between items-center h-16 md:h-20 lg:h-24">
          {/*logo content*/}
          <div className="flex-shrink-0 flex items-center space-x-2 group relative md:-translate-x-4 lg:-translate-x-6 ml-0 md:ml-2">
            <div className="absolute -inset-4 bg-amber-500/10 rounded-full blur-xl opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300" />
            <GiChefToque className="text-3xl md:text-4xl lg:text-5xl text-amber-500 transition-all group-hover:rotate-12 group-hover:text-amber-400 hover:drop-shadow-[0_0_15px] hover:drop-shadow-500/30" />

            <div className="flex flex-col relative ml-2 max-w-[140px] md:max-w-[160px] lg:max-w-none">
              <NavLink
                to="/"
                className="text-2xl md:text-xl lg:text-4xl bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent font-monsieur tracking-wider drop-shadow-[0_2px_2px] drop-shadow-black -translate-x-2 truncate md:truncate-none"
              >
                FoodHop
              </NavLink>
              <div className="h-[3px] bg-gradient-to-r from-amber-600/30 via-amber-400/50 to-amber-600/30 mt-1 ml-1 shadow-[0_2px_5px] shadow-amber-500/20" />
            </div>
          </div>

          {/*desktop navigation*/}
          <div className="hidden md:flex items-center space-x-2 md:space-x-1 lg:space-x-4 flex-1 justify-end">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) =>
                  `group px-3 md:px-3 lg:px-4 py-2 md:py-2 lg:py-3 text-sm md:text-[15px] lg:text-base relative transition-all duration-300 flex items-center hover:bg-amber-900/20 rounded-3xl border-2 ${
                    isActive
                      ? "border-amber-600/50 bg-amber-900/20 shadow-[inset_0_0_15px] shadow-amber-500/20"
                      : "border-amber-900/30 hover:border-amber-600/50"
                  }shadow-md shadow-amber-900/20`
                }
              >
                <span className="mr-2 text-sm md:text-[15px] lg:text-base text-amber-500 group-hover:text-amber-300 transition-all">
                  {link.icon}
                </span>
                <span className="text-amber-100 group-hover:text-amber-300 relative">
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-amber-400 transition-all group-hover:w-full" />
                </span>
              </NavLink>
            ))}

            <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 ml-3">
              <NavLink
                to="/cart"
                className="p-2 md:p-2.0 lg:p-3 text-amber-100 rounded-xl transition-all relative border-2 border-amber-900/30 hover:border-amber-600/50 group hover:bg-amber-900/20 hover:shadow-lg hover:shadow-amber-500/30 shadow-amber-900/20"
              >
                <FiShoppingCart className="text-base md:text-lg lg:text-lg" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
