import React, { useState } from "react";
import { FaDownload, FaPlay, FaSearch, FaTimes } from "react-icons/fa";
import { bannerAssets } from "../../assets/dummydata";

const Banner = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  const { bannerImage, orbitImages, video } = bannerAssets;

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("searching for :", searchQuery);
  };

  return (
    <section className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 text-white overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-amber-700/10"></div>

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 py-12 sm:py-16 gap-10 md:gap-16">
        {/* Left Section */}
        <div className="flex-1 text-center md:text-left space-y-6 sm:space-y-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight font-serif drop-shadow-md">
            We’re here <br />
            <span className="text-amber-400 bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
              For Food and Delivery
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl italic font-playfair text-amber-100 opacity-90 max-w-md mx-auto md:mx-0">
            Best cooks and best delivery guys all at your service — hot, tasty
            food will reach you in 60 minutes.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="relative max-w-md mx-auto md:mx-0"
          >
            <div className="flex items-center bg-amber-900/30 rounded-xl border-2 border-amber-500 focus-within:border-amber-300 transition">
              <span className="pl-4 pr-3">
                <FaSearch className="text-lg sm:text-xl text-amber-400/80" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Discover your next favourite meal..."
                className="w-full py-3 bg-transparent outline-none placeholder-amber-200/70 text-base sm:text-lg font-medium tracking-wide"
              />
              <button
                type="submit"
                className="mr-3 sm:mr-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-400 to-amber-300 rounded-lg font-semibold text-amber-900 hover:from-amber-300 hover:to-amber-200 transition-all duration-300 shadow hover:shadow-amber-300/20"
              >
                Search
              </button>
            </div>
          </form>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 mt-4">
            <button className="group flex items-center gap-2 sm:gap-3 bg-amber-800/30 hover:bg-amber-800/50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-amber-700/50 hover:border-amber-400/50 transition">
              <FaDownload className="text-lg sm:text-xl text-amber-400 group-hover:animate-bounce" />
              <span className="text-base sm:text-lg">Download App</span>
            </button>

            <button
              onClick={() => setShowVideo(true)}
              className="group flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-md hover:shadow-amber-300/10 transition"
            >
              <FaPlay className="text-base sm:text-lg text-amber-900" />
              <span className="text-base sm:text-lg text-amber-900 font-semibold">
                Watch Video
              </span>
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 relative mt-8 md:mt-0 flex justify-center overflow-visible">
          <div className="relative rounded-full p-1 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-400 shadow-2xl z-20 w-[200px] sm:w-[250px] md:w-[320px] h-[200px] sm:h-[250px] md:h-[320px]">
            <img
              src={bannerImage}
              alt="Banner"
              className="rounded-full border-4 sm:border-8 border-amber-900/50 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-amber-900/40 mix-blend-multiply" />
          </div>

          {/* Orbit Images */}
          {orbitImages.map((imgSrc, index) => (
            <div
              key={index}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
                index === 0 ? "orbit" : `orbit-delay-${index * 5}`
              } w-[60px] sm:w-[90px] md:w-[120px] h-[60px] sm:h-[90px] md:h-[120px]`}
            >
              <img
                src={imgSrc}
                alt={`Orbit ${index + 1}`}
                className="w-full h-full rounded-full border border-amber-500/30 shadow-lg bg-amber-900 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 backdrop-blur-md p-4">
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-6 right-6 text-amber-400 hover:text-amber-300 text-3xl transition-all"
          >
            <FaTimes />
          </button>

          <div className="w-full max-w-4xl mx-auto">
            <video
              controls
              autoPlay
              className="w-full aspect-video object-contain rounded-lg"
            >
              <source src={video} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </section>
  );
};

export default Banner;
