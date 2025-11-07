import React from "react";

// FloatingParticle: renders a few small floating dots. Accepts optional `count` prop.
const FloatingParticle = ({ count = 8 }) => {
  const particles = Array.from({ length: count }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            animation: `float ${p.duration}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticle;
