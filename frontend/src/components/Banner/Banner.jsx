import React from "react";

const Banner = () => {
  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 text-white py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-amber-700/10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-1 space-y-8 relative md:pr-8 lg:pr-19 text-center md:text-left"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
