import { SparklesIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;
const slideInFromLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { delay, duration: 0.6, ease } },
});
const slideInFromRight = (delay = 0) => ({
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { delay, duration: 0.6, ease } },
});
const slideInFromTop = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function SpaceHero() {
  return (
    <section className="relative flex flex-col h-[80vh] w-full items-center justify-center overflow-hidden bg-gradient-bg">
      <video autoPlay muted loop className="rotate-180 absolute top-[-340px] left-0 w-full h-full object-cover -z-20 opacity-80 data-[theme=light]:opacity-40">
        <source src="/blackhole.webm" type="video/webm" />
      </video>

      {/* Theme-aware gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg/60 -z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-bg-secondary/20 via-transparent to-bg-tertiary/20 -z-10"></div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col md:flex-row items-center justify-center px-6 md:px-20 w-full z-[20]">
        <div className="h-full w-full flex flex-col gap-5 justify-center text-start">
          <motion.div variants={slideInFromTop} className="py-2 px-2 border border-border bg-bg-glass backdrop-blur-md rounded-lg w-max shadow-theme-sm hover:border-border-hover transition-all duration-300">
            <div className="flex items-center gap-2">
              <SparklesIcon className="text-accent-secondary h-5 w-5" />
              <span className="text-[13px] text-fg-secondary">Fullstack Developer Portfolio</span>
            </div>
          </motion.div>

          <motion.h2 variants={slideInFromLeft(0.3)} className="mt-4 text-4xl md:text-6xl font-bold max-w-2xl text-fg">
            Providing <span className="text-transparent bg-clip-text bg-gradient-primary">the best</span> project experience.
          </motion.h2>

          <motion.p variants={slideInFromLeft(0.6)} className="text-lg text-fg-secondary my-5 max-w-xl">
            I build web apps with React, Three.js and modern tooling. Explore my projects and skills.
          </motion.p>

          <motion.a 
            variants={slideInFromLeft(0.9)} 
            href="#projects" 
            className="py-3 px-6 rounded-lg bg-bg-glass backdrop-blur-md border border-border hover:border-border-hover text-fg-secondary hover:text-fg w-max shadow-theme-sm hover:shadow-theme-md transition-all duration-300 hover:scale-105 hover:animate-pulse-glow"
          >
            Learn more
          </motion.a>
        </div>

        <motion.img 
          variants={slideInFromRight(0.3)} 
          src="/hero-bg.svg" 
          alt="work icons" 
          width={650} 
          height={650} 
          className="select-none max-w-[70%] md:max-w-none filter drop-shadow-lg" 
        />
      </motion.div>
    </section>
  );
}
