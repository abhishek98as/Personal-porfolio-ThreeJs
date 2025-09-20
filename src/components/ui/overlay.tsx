'use client';

import { Scroll, useProgress } from '@react-three/drei';
import { ArrowDown, Github, Linkedin } from 'lucide-react';
import { Button } from './button';
import { useMediaQuery } from '@/hooks/use-media-query';

const sections = [
  { id: 'hero', name: 'Home' },
  { id: 'projects', name: 'Projects' },
  { id: 'skills', name: 'Skills' },
  { id: 'timeline', name: 'Experience' },
  { id: 'contact', name: 'Contact' },
];

function VerticalNav({ onNavigate, activeSection }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  if (isMobile) return null;

  return (
    <nav className="fixed top-1/2 right-4 md:right-8 -translate-y-1/2 z-50">
      <ul className="flex flex-col items-center gap-4">
        {sections.map((section, index) => (
          <li key={section.id}>
            <button
              onClick={() => onNavigate(index)}
              className="group flex items-center gap-2"
              aria-label={`Go to ${section.name} section`}
            >
              <span className="text-right text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-2 font-headline">
                {section.name}
              </span>
              <div
                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                  activeSection === index
                    ? 'bg-accent scale-150'
                    : 'bg-foreground/50 group-hover:bg-foreground'
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Overlay() {
  const { progress } = useProgress();

  return (
    <Scroll
      html
      style={{
        width: '100%',
        height: '100%',
        top: '0px',
        left: '0px',
        position: 'absolute',
      }}
    >
      <div className="w-full h-full">
        {progress === 100 && (
          <header className="fixed top-0 left-0 w-full p-4 md:p-8 z-50 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold font-headline">
              Threefolio
            </h1>
            <div className="flex items-center gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
              >
                <Github className="w-6 h-6 hover:text-accent transition-colors" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-6 h-6 hover:text-accent transition-colors" />
              </a>
            </div>
          </header>
        )}

        <div className="w-full h-[500vh]">
          {/* Scroll container height, 100vh per section */}
        </div>

        {progress === 100 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            <ArrowDown className="w-6 h-6" />
          </div>
        )}

        <footer className="absolute bottom-0 w-full p-4 text-center text-muted-foreground text-xs z-50" style={{top: '495vh'}}>
          © {new Date().getFullYear()} Threefolio. All rights reserved.
        </footer>
      </div>
    </Scroll>
  );
}
