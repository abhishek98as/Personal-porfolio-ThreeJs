import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import NavigationMenu from './components/NavigationMenu';
import Hero3D from './components/Hero3D';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Timeline from './sections/Timeline';
import Testimonials from './sections/Testimonials';
import WorkExperience from './sections/WorkExperience';
import CodingPassion from './sections/CodingPassion';
import LetsTalk from './sections/LetsTalk';
import Playground from './sections/Playground';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import PreFooter from './sections/PreFooter';
import SpaceHero from './sections/SpaceHero';
import SpaceProjects from './sections/SpaceProjects';
import SpaceSkills from './sections/SpaceSkills';
import UserFaceButton from './components/UserFaceButton';

const FaceOverlay = lazy(() => import('./components/FaceOverlay'));

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'timeline', label: 'Experience' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'work-experience', label: 'Work History' },
  { id: 'coding-passion', label: 'My Passion' },
  { id: 'lets-talk', label: "Let's Talk" },
  { id: 'playground', label: 'Playground' },
  { id: 'contact', label: 'Contact' },
  { id: 'prefooter', label: 'Stars' },
  { id: 'footer', label: 'End' },
];

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  useSmoothScroll(containerRef, { wheelMultiplier: 0.8, damping: 0.12, enabled: true });
  const [showFace, setShowFace] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const ids = sections.map((s) => s.id);
      const rects = ids
        .map((id) => document.getElementById(id)!)
        .map((el) => ({ id: el.id, top: el.getBoundingClientRect().top }));
      const current = rects.reduce((acc, r) => (Math.abs(r.top) < Math.abs(acc.top) ? r : acc));
      const idx = ids.indexOf(current.id);
      if (e.key === 'ArrowDown') {
        const next = document.getElementById(ids[Math.min(idx + 1, ids.length - 1)]);
        next?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'ArrowUp') {
        const prev = document.getElementById(ids[Math.max(idx - 1, 0)]);
        prev?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-bg text-fg transition-colors duration-300">
      <NavigationMenu sections={sections} />
      <UserFaceButton onClick={() => setShowFace(true)} />
      {showFace && (
        <Suspense fallback={null}>
          <FaceOverlay onClose={() => setShowFace(false)} />
        </Suspense>
      )}
      <div ref={containerRef} className="scroll-container h-screen overflow-y-scroll snap-y snap-mandatory bg-bg">
        <section id="hero" className="snap-section h-screen flex items-center justify-center">
          <Hero3D onViewProjects={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} />
        </section>
        <section id="projects" className="snap-section min-h-screen py-16 bg-gradient-to-b from-bg to-bg-secondary">
          <Projects />
        </section>
        <section id="skills" className="snap-section min-h-screen py-16 bg-gradient-to-b from-bg-secondary to-bg">
          <Skills />
        </section>
        <section id="timeline" className="snap-section min-h-screen py-16 bg-gradient-to-b from-bg to-bg-tertiary">
          <Timeline />
        </section>
        <section id="testimonials" className="snap-section min-h-screen py-16 bg-gradient-to-b from-bg-tertiary to-bg-secondary">
          <Testimonials />
        </section>
        <section id="work-experience" className="snap-section min-h-screen py-16 bg-gradient-to-b from-bg-secondary to-bg-tertiary">
          <WorkExperience />
        </section>
        <section id="coding-passion" className="snap-section min-h-screen py-16 bg-gradient-to-b from-bg-tertiary to-bg-secondary">
          <CodingPassion />
        </section>
        <section id="lets-talk" className="snap-section min-h-screen py-16 bg-gradient-to-b from-bg-secondary to-bg-tertiary">
          <LetsTalk />
        </section>
        <section id="playground" className="snap-section min-h-screen py-16 bg-gradient-to-b from-bg-tertiary to-bg-secondary">
          <Playground />
        </section>
        <section id="contact" className="snap-section min-h-screen py-16 bg-gradient-to-b from-bg-secondary to-bg">
          <Contact />
        </section>
        {/* Space-portfolio inspired sections */}
        <section id="space-hero" className="snap-section min-h-[80vh] py-0">
          <SpaceHero />
        </section>
        <section id="space-projects" className="snap-section min-h-[70vh] py-0">
          <SpaceProjects />
        </section>
        <section id="space-skills" className="snap-section min-h-[70vh] py-0 bg-gradient-to-b from-bg to-bg-secondary">
          <SpaceSkills />
        </section>
        {/* Removed Performance & Security section per request */}
        <section id="prefooter" className="snap-section min-h-[80vh] py-0 bg-gradient-to-b from-bg-secondary to-bg">
          <PreFooter />
        </section>
        <section id="footer" className="snap-section py-0" style={{ scrollSnapAlign: 'end' }}>
          <Footer />
        </section>
      </div>
    </div>
  );
}
