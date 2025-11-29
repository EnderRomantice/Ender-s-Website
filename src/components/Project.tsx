import { motion } from "motion/react";

export default function Project() {
  return (
    <motion.div
      id="project"
      className="h-screen flex items-center justify-center text-white"
      exit={{ opacity: 0 }}
    >
      <div>Project</div>
    </motion.div>
  );
}
