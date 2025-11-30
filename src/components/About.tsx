import { motion } from "motion/react";

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="group flex flex-col md:flex-row space-x-4 md:space-x-8 justify-center items-center text-white md:space-y-0 space-y-12"
    >
      <motion.div className="flex flex-col text-center justify-center space-y-4 items-center transition group-hover:bg-white group-hover:text-black group-hover:scale-105 md:w-60 w-80 rounded-4xl">
        <motion.img
          src="/ender.webp"
          alt="Ender's Avatar"
          className="w-24 h-24 rounded-full my-10"
        />

        <h1>Ender</h1>
        <h2>Full-Stack Developer</h2>
        <h3 className="mb-4">working: XTrace</h3>
      </motion.div>

      <motion.div className="w-100 md:text-4xl text-2xl text-center md:mx-4 mx-8">
        I'm a software development engineer currently living in Chengdu. If you
        live here or happen to be here, feel free to grab a coffee with me :P
      </motion.div>
    </motion.div>
  );
}
