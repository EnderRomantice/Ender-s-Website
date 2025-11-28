// src/components/TechLogos.tsx

import React, { ImgHTMLAttributes } from 'react';


interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: number | string;
}

export const AstroLogo: React.FC<LogoProps> = ({ size = 24, className = '', ...props }) => (
  <img src="/astro.svg" alt="Astro Logo" width={size} height={size} className={className} {...props} />
);

export const ReactLogo: React.FC<LogoProps> = ({ size = 24, className = '', ...props }) => (
  <img src="/react.svg" alt="React Logo" width={size} height={size} className={className} {...props} />
);

export const TailwindCSSLogo: React.FC<LogoProps> = ({ size = 24, className = '', ...props }) => (
  <img src="/tailwindcss.svg" alt="Tailwind CSS Logo" width={size} height={size} className={className} {...props} />
);

export const PythonLogo: React.FC<LogoProps> = ({ size = 24, className = '', ...props }) => (
  <img src="/python.svg" alt="Python Logo" width={size} height={size} className={className} {...props} />
);

export const VercelLogo: React.FC<LogoProps> = ({ size = 24, className = '', ...props }) => (
  <img src="/vercel.svg" alt="Vercel Logo" width={size} height={size} className={className} {...props} />
);

export const TypeScriptLogo: React.FC<LogoProps> = ({ size = 24, className = '', ...props }) => (
  <img src="/typescript.svg" alt="TypeScript Logo" width={size} height={size} className={className} {...props} />
);

export const NextJSLogo: React.FC<LogoProps> = ({ size = 24, className = '', ...props }) => (
  <img src="/nextdotjs.svg" alt="Next.js Logo" width={size} height={size} className={className} {...props} />
);

export const GoLogo: React.FC<LogoProps> = ({ size = 24, className = '', ...props }) => (
  <img src="/go.svg" alt="Go Logo" width={size} height={size} className={className} {...props} />
);

export const FastapiLogo: React.FC<LogoProps> = ({ size = 24, className = '', ...props }) => (
  <img src="/fastapi.svg" alt="Fastapi Logo" width={size} height={size} className={className} {...props} />
);


export const techLogos = [
  { node: <AstroLogo />, title: "Astro", href: "https://astro.build"},
  { node: <ReactLogo />, title: "React", href: "https://react.dev" },
  { node: <NextJSLogo />, title: "Next.js", href: "https://nextjs.org" },
  { node: <TypeScriptLogo />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <TailwindCSSLogo />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];
