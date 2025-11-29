import { motion } from "motion/react";
import {project_items} from "../lib/project_config.ts";

export default function Project() {
  return (
    <motion.div
      id="project"
      className="h-screen flex flex-col items-center justify-center text-white space-y-4"
    >


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
          {project_items.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="z-50 mx-4 p-4 rounded-lg shadow-md text-white hover:bg transition duration-300 ease-in-out"
            >

              <h3 className="text-xl">{project.name}</h3>
              <p className="text-gray-400">{project.description}</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Project</a>
            </motion.div>
          ))}

      </motion.div>
    </motion.div>
  );
}
