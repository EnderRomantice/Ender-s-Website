import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { tech_items, tech_line_colors } from "../lib/tech_config.ts";

export default function Tech() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [targets, setTargets] = useState<Array<{ x: number; y: number }>>([]);
  const [fadeSeed, setFadeSeed] = useState(0);

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
    setFadeSeed(Date.now());
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
      setFadeSeed(Date.now());
    };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const { width, height } = el.getBoundingClientRect();
            const pad = 36;
            const arr = tech_items.map(() => ({
              x: pad + Math.random() * (width - pad * 2),
              y: pad + Math.random() * (height - pad * 2),
            }));
            setTargets(arr);
            setFadeSeed(Date.now());
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <motion.div
      id="tech"
      className="h-screen w-screen flex flex-col items-center justify-center text-black space-y-4"
    >
      <motion.div
        ref={containerRef}
        className="relative w-full h-[85vh] md:h-[88vh] md:px-8 px-4"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <div className="italic text-neutral-400/20 text-5xl md:text-7xl lg:text-8xl leading-tight text-center px-8 max-w-6xl">
            I usually use these technologies to get my work done — they're my
            trusted tools and loyal companions.
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >

        <svg className="absolute inset-0 z-0" width="100%" height="100%">
          {targets.length === tech_items.length && (() => {
            const groups: Record<string, number[]> = {};
            tech_items.forEach((t, i) => {
              const k = (t as any).type || "unknown";
              if (!groups[k]) groups[k] = [];
              groups[k].push(i);
            });
            const lines: JSX.Element[] = [];
            let lineCounter = 0;
            Object.entries(groups).forEach(([type, idxs]) => {
              const color = tech_line_colors[type] || "rgba(255,255,255,0.15)";
              for (let i = 0; i < idxs.length - 1; i++) {
                const a = targets[idxs[i]];
                const b = targets[idxs[i + 1]];
                const ax = (a?.x || 0) + 36;
                const ay = (a?.y || 0) + 36;
                const bx = (b?.x || 0) + 36;
                const by = (b?.y || 0) + 36;
                lines.push(
                  <motion.line
                    key={`${type}-${idxs[i]}-${idxs[i + 1]}`}
                    x1={ax}
                    y1={ay}
                    x2={bx}
                    y2={by}
                    stroke={color}
                    strokeWidth={2}
                    initial={{ opacity: 0, strokeWidth: 0 }}
                    whileInView={{ opacity: 1, strokeWidth: 2 }}
                    animate={{ x1: ax, y1: ay, x2: bx, y2: by }}
                    transition={{ duration: 0.5, delay: lineCounter * 0.05 }}
                    style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                  />
                );
                lineCounter++;
              }
            });
            return lines;
          })()}
        </svg>

        {tech_items.map((tech, index) => (
          <TechItem
            key={`${fadeSeed}-${index}`}
            tech={tech}
            index={index}
            containerRef={containerRef}
            target={targets[index]}
          />
        ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function TechItem({ tech, index, containerRef, target }: { tech: { name: string; image: string; link?: string; type?: string }; index: number; containerRef: React.RefObject<HTMLDivElement>; target?: { x: number; y: number } }) {
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
    const state = { x: pos.x, y: pos.y } as any;
    gsap.to(state, {
      x: tX,
      y: tY,
      duration: 0.4,
      ease: "power2.out",
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
      className="z-10 absolute p-4 rounded-4xl border border-white/10 shadow-lg select-none no-underline text-current bg-white text-black"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    >
      <motion.div className="flex flex-col items-center gap-3" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.06 }}>
        {tech.image && (
          <img src={tech.image} alt={tech.name} className="w-12 h-12" />
        )}
        <h4 className="text-base font-semibold tracking-tight">{tech.name}</h4>
      </motion.div>
    </a>
  );
}
