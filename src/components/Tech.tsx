import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { tech_items } from "../lib/tech_config.ts";

export default function Tech() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [targets, setTargets] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const pad = 36;
    const halton = (i: number, b: number) => {
      let f = 1;
      let r = 0;
      while (i > 0) {
        f = f / b;
        r = r + f * (i % b);
        i = Math.floor(i / b);
      }
      return r;
    };
    const arr = tech_items.map((_, i) => {
      const hx = halton(i + 1, 2);
      const hy = halton(i + 1, 3);
      const jx = (Math.random() - 0.5) * 0.08;
      const jy = (Math.random() - 0.5) * 0.08;
      const x = pad + (hx + jx) * (width - pad * 2);
      const y = pad + (hy + jy) * (height - pad * 2);
      return { x, y };
    });
    setTargets(arr);
  }, []);

  useEffect(() => {
    const h = () => {
      const el = containerRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      const pad = 36;
      const halton = (i: number, b: number) => {
        let f = 1;
        let r = 0;
        while (i > 0) {
          f = f / b;
          r = r + f * (i % b);
          i = Math.floor(i / b);
        }
        return r;
      };
      const arr = tech_items.map((_, i) => {
        const hx = halton(i + 1, 2);
        const hy = halton(i + 1, 3);
        const x = pad + hx * (width - pad * 2);
        const y = pad + hy * (height - pad * 2);
        return { x, y };
      });
      setTargets(arr);
    };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return (
    <motion.div
      id="tech"
      className="h-screen w-screen flex flex-col items-center justify-center text-white space-y-4"
    >
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[85vh] md:h-[88vh] md:px-8 px-4"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <div className="italic text-neutral-400/20 text-5xl md:text-7xl lg:text-8xl leading-tight text-center px-8 max-w-6xl">
            I usually use these technologies to get my work done — they're my
            trusted tools and loyal companions.
          </div>
        </div>
        {tech_items.map((tech, index) => (
          <TechItem
            key={index}
            tech={tech}
            index={index}
            containerRef={containerRef}
            target={targets[index]}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

function TechItem({
  tech,
  index,
  containerRef,
  target,
}: {
  tech: { name: string; image: string; link?: string };
  index: number;
  containerRef: React.RefObject<HTMLDivElement>;
  target?: { x: number; y: number };
}) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const homeRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const el = elRef.current;
    if (!container || !el) return;
    const cb = container.getBoundingClientRect();
    const eb = el.getBoundingClientRect();
    const pad = 24;
    const minX = pad;
    const minY = pad;
    const maxX = Math.max(pad, cb.width - eb.width - pad);
    const maxY = Math.max(pad, cb.height - eb.height - pad);
    const tX = target
      ? Math.min(maxX, Math.max(minX, target.x))
      : Math.random() * (maxX - minX) + minX;
    const tY = target
      ? Math.min(maxY, Math.max(minY, target.y))
      : Math.random() * (maxY - minY) + minY;
    homeRef.current = { x: tX, y: tY };
    const startEdge = Math.floor(Math.random() * 4);
    const startX =
      startEdge === 0
        ? -cb.width * 0.2
        : startEdge === 1
          ? cb.width * 1.2
          : Math.random() * cb.width;
    const startY =
      startEdge === 2
        ? -cb.height * 0.2
        : startEdge === 3
          ? cb.height * 1.2
          : Math.random() * cb.height;
    setPos({ x: startX, y: startY });
    gsap.set(el, { backgroundColor: "rgba(255,255,255,0.1)", color: "#fff" });
    gsap.to(el, {
      backgroundColor: "#ffffff",
      color: "#000000",
      duration: 1.6 + index * 0.08,
      ease: "power2.out",
    });
    const state = { x: startX, y: startY } as any;
    gsap.to(state, {
      x: tX,
      y: tY,
      duration: 2.1 + index * 0.1,
      ease: "power3.out",
      onUpdate: function () {
        setPos({ x: state.x, y: state.y });
      },
    });
  }, [containerRef, index, target?.x, target?.y]);

  const onMouseEnter = () => {};
  const onMouseLeave = () => {};

  return (
    <a
      ref={elRef as any}
      href={tech.link || "#"}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={`Open ${tech.name} docs`}
      className="absolute p-4 rounded-4xl border border-white/10 shadow-lg select-none no-underline text-current"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    >
      <div className="flex flex-col items-center gap-3">
        {tech.image && (
          <img src={tech.image} alt={tech.name} className="w-12 h-12" />
        )}
        <h4 className="text-base font-semibold tracking-tight">{tech.name}</h4>
      </div>
    </a>
  );
}
