import { motion } from "motion/react";
import {
  about_lines,
  about_animation,
  about_profile,
} from "../lib/about_config.ts";
import React, { useState } from "react";

export default function About() {
  const lines = about_lines.map((l) => Array.from(l));
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const maxTilt = 6;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="group flex flex-col md:flex-row space-x-4 md:space-x-8 justify-center items-center text-white md:space-y-0 space-y-12"
    >
      <motion.div
        className="group flex flex-col text-center justify-center space-y-1 items-center md:w-60 w-80 rounded-4xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg hover:bg-white hover:text-black hover:shadow-xl transition duration-300 ease-out will-change-transform"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setTilt({ x: 0, y: 0 });
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const px = x / rect.width;
          const py = y / rect.height;
          const rx = (px - 0.5) * 2 * maxTilt;
          const ry = (0.5 - py) * 2 * maxTilt;
          setTilt({ x: rx, y: ry });
        }}
        style={{
          transform: `perspective(600px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(${hovered ? 1.05 : 1})`,
        }}
      >
        <motion.img
          src="/ender.webp"
          alt="Ender's Avatar"
          className="w-24 h-24 rounded-full my-10 ring-4 ring-white/40 transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] shadow-blue-600"
        />

        <h1>{about_profile.name}</h1>
        <h2>open-source contributor</h2>
        <h3 className="mb-4">{about_profile.live}</h3>
      </motion.div>

      <motion.div className="w-120 md:text-4xl text-2xl text-center md:mx-4 mx-8 space-y-2">
        {lines.map((chars, lineIdx) => (
          <div key={lineIdx}>
            {chars.map((ch, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 4 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: about_animation.duration,
                  delay:
                    about_animation.delay_start +
                    lineIdx * 0.2 +
                    idx * about_animation.stagger,
                }}
                className="inline-block"
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
