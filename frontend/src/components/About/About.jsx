import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a120b] via-[#3c2a21] to-[#1a120b] text-amber-500 overflow-hidden relative">
      <div className="about insert-0 opacity-10 mix-blend-soft-light" />
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-16 px-4 text-center relative"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 font-serif bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-600">
            Culinary Express
          </motion.h1>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
