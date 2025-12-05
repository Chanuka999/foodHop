import React from "react";
import { FiArrowDownLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

const MyOrder = () => {
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
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
