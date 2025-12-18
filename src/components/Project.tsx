import { motion } from "motion/react";
import { project_items } from "../lib/project_config.ts";

export default function Project() {
  return (
    <motion.div
      id="project"
      className=" h-screen flex flex-col items-center justify-center text-white space-y-4 relative"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <div className="italic text-neutral-400/20 text-5xl md:text-7xl lg:text-8xl leading-tight text-center px-8 max-w-6xl">
          Projects I've created or helped maintain
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:px-8 px-4"
      >
        {project_items.map((project, index) => (
          <motion.div
            onClick={() => window.open(project.link, "_blank")}
             key={index}
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
             whileHover={{ scale: 1.02 }}
            className="group md:mx-4 mx-8 p-4 rounded-lg shadow-md hover:shadow-xl text-white hover:bg-gray-100/40 transition-all duration-300 ease-out cursor-pointer will-change-transform transform-gpu hover:z-10 relative"
          >
             <h3 className="text-xl group-hover:text-gray-100 transition-colors duration-300">
              {project.name}
            </h3>

            <p className="text-gray-300 group-hover:text-gray-400 transition-colors duration-300">
              {project.description}
            </p>
            {Array.isArray((project as any).tags) &&
              (project as any).tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(project as any).tags.map((tag: string, i: number) => (
                     <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full border border-white/20 bg-white/10 text-white group-hover:text-white group-hover:bg-white/30 group-hover:border-white/50 transition-colors duration-300 ease-out"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
