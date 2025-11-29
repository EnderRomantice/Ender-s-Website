import { motion } from "motion/react";
import { time } from "motion/react-m";

export default function Ease() {
  return (
    <motion.div
      id="home"
      className="text-white h-screen flex flex-col items-center justify-center"
    >
      <motion.h1
        className="text-4xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        Hi, I'm Ender.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 5 }}
      >
        Software engineers, open-source enthusiasts, low-level developers, and
        designers.
      </motion.p>
    </motion.div>
  );
}
