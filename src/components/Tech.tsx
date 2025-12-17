import { motion } from "motion/react";
import InfiniteMenu from "./InfiniteMenu.tsx";
import { tech_items } from "../lib/tech_config.ts";

export default function Tech() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full h-full"
    >
      <InfiniteMenu items={tech_items} />
    </motion.div>
  );
}
