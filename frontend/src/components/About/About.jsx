import React, { useState } from "react";
import { motion, scale } from "framer-motion";
import { features, stats, teamMembers } from "../../assets/dummydata";

const About = () => {
  const [hoveredStat, setHoverdStat] = useState(null);
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
          <motion.p>
            Crafting unforgetable dining experience deliveres to your doorstap
          </motion.p>
        </div>
      </motion.section>

      <section className="py-12 px-4 md:px-8 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10px 0px" }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-amber-600/30 to-amber-500/30 rounded-3xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

                <div className="relative bg-[#3c2a21]/30 backdrop-blur-lg rounded-3xl overflow-hidden border border-amber-600/30 hover:border-amber-500 transition-all duration-300 h-full">
                  <div className="relative ">
                    <motion.img
                      src={f.img}
                      alt={f.title}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e120b] via-transparent to-transparent" />
                  </div>
                  <div className="p-8">
                    <motion.div
                      className="text-amber-500 mb-4 inline-block"
                      whileHover={{ rotate: 15 }}
                    >
                      <Icon className="w-12 h-12 text-amber-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2 text-amber-100">
                      {f.title}
                    </h3>
                    <p className="text-amber-100/80">{f.text}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-[#1a120b] to-[#3c2a21]/90">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, type: "spring" }}
                className="relative group h-48"
                onHoverStart={() => setHoverdStat(i)}
                animate={{
                  scale: hoveredStat == i ? 1.05 : 1,
                  zIndex: hoveredStat === i ? 10 : 1,
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    y: [0, -15, 0],
                    transition: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3,
                    },
                  }}
                >
                  <div className="relative w-full bg-[#3c2a21]/40 backdrop-blur-lg rounded-xl border-2 border-amber-600/30 p-6 overflow-hidden transition-all duration-300"></div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default About;
