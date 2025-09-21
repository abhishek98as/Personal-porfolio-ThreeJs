import { useEffect, useMemo, useState } from 'react';
import { useUI } from '../store/useUI';

type Section = { id: string; label: string };

type Props = { sections: Section[] };

const Icon = ({ id, active }: { id: string; active: boolean }) => {
  const common = 'w-5 h-5 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]';
  switch (id) {
    case 'hero':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <defs>
            <linearGradient id={`g-hero`} x1="0" x2="1">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <path fill={active ? 'url(#g-hero)' : 'currentColor'} d="M12 3l9 6-9 6-9-6 9-6Zm0 8.25 6.75-4.5L12 2.25 5.25 6.75 12 11.25Z" />
        </svg>
      );
    case 'projects':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <defs>
            <linearGradient id={`g-proj`} x1="0" x2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          <path fill={active ? 'url(#g-proj)' : 'currentColor'} d="M4 7h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Zm2-4h12l2 4H4l2-4Z" />
        </svg>
      );
    case 'skills':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <defs>
            <radialGradient id={`g-skill`} cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#67e8f9" />
            </radialGradient>
          </defs>
          <path fill={active ? 'url(#g-skill)' : 'currentColor'} d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 3a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z" />
        </svg>
      );
    case 'timeline':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <defs>
            <linearGradient id={`g-time`} x1="0" x2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <path fill={active ? 'url(#g-time)' : 'currentColor'} d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3Z" />
        </svg>
      );
    case 'playground':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <defs>
            <linearGradient id={`g-play`} x1="0" x2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path fill={active ? 'url(#g-play)' : 'currentColor'} d="M8 5v14l11-7L8 5Z" />
        </svg>
      );
    case 'contact':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <defs>
            <linearGradient id={`g-contact`} x1="0" x2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path fill={active ? 'url(#g-contact)' : 'currentColor'} d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM8.5 15 4 10.5l1.41-1.41L8.5 12.17l6.59-6.59L16.5 7 8.5 15Z" />
        </svg>
      );
    case 'space-hero':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <defs>
            <radialGradient id={`g-space-hero`} cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
          </defs>
          <path fill={active ? 'url(#g-space-hero)' : 'currentColor'} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
        </svg>
      );
    case 'space-projects':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <defs>
            <linearGradient id={`g-space-proj`} x1="0" x2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <path fill={active ? 'url(#g-space-proj)' : 'currentColor'} d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12Zm4.64-1.96a7.5 7.5 0 0 1 10.32 0L12 16l-5.36-5.96Z" />
        </svg>
      );
    case 'space-skills':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <defs>
            <linearGradient id={`g-space-skills`} x1="0" x2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path fill={active ? 'url(#g-space-skills)' : 'currentColor'} d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3Zm0 2C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14 14 11.99 14 9.5 11.99 5 9.5 5Z" />
        </svg>
      );
    case 'space-encryption':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <defs>
            <linearGradient id={`g-space-encrypt`} x1="0" x2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          <path fill={active ? 'url(#g-space-encrypt)' : 'currentColor'} d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2ZM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6Zm9 14H6V10h12v10Zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Z" />
        </svg>
      );
    case 'prefooter':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <defs>
            <radialGradient id={`g-stars`} cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#a78bfa" />
            </radialGradient>
          </defs>
          <path fill={active ? 'url(#g-stars)' : 'currentColor'} d="M12 2l1.9 4 4.4.4-3.3 2.9.98 4.3L12 12.9 8.02 13.6l.98-4.3L5.7 6.4l4.4-.4L12 2Z" />
        </svg>
      );
    case 'footer':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <defs>
            <linearGradient id={`g-footer`} x1="0" x2="1">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          <path fill={active ? 'url(#g-footer)' : 'currentColor'} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM7 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5Zm5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5Zm5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5Z" />
        </svg>
      );
    default:
      return null;
  }
};

const ThemeToggleIcon = ({ isDark }: { isDark: boolean }) => {
  const common = 'w-5 h-5 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)] transition-all duration-300';
  
  if (isDark) {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none">
        <defs>
          <linearGradient id="moon-gradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
        </defs>
        <path
          fill="url(#moon-gradient)"
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        />
        <circle cx="15" cy="8" r="0.5" fill="#ffffff" opacity="0.8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="18" cy="11" r="0.3" fill="#ffffff" opacity="0.6">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/>
        </circle>
      </svg>
    );
  }
  
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none">
      <defs>
        <linearGradient id="sun-gradient" x1="0" x2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="4" fill="url(#sun-gradient)">
        <animate attributeName="r" values="4;4.5;4" dur="2s" repeatCount="indefinite"/>
      </circle>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
        <line
          key={angle}
          x1={12 + Math.cos((angle * Math.PI) / 180) * 7}
          y1={12 + Math.sin((angle * Math.PI) / 180) * 7}
          x2={12 + Math.cos((angle * Math.PI) / 180) * 9}
          y2={12 + Math.sin((angle * Math.PI) / 180) * 9}
          stroke="url(#sun-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        >
          <animate 
            attributeName="opacity" 
            values="0.4;1;0.4" 
            dur={`${1.5 + index * 0.1}s`} 
            repeatCount="indefinite"
          />
        </line>
      ))}
    </svg>
  );
};

export default function NavigationMenu({ sections }: Props) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? '');
  const { theme, setTheme } = useUI();
  const [isAnimating, setIsAnimating] = useState(false);
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const compute = () => {
      const nearest = ids
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .map((el) => ({ id: el!.id, top: Math.abs(el!.getBoundingClientRect().top) }))
        .sort((a, b) => a.top - b.top)[0];
      if (nearest && nearest.id !== active) setActive(nearest.id);
    };
    compute();
    const opts: AddEventListenerOptions = { passive: true } as any;
    window.addEventListener('scroll', compute, opts);
    window.addEventListener('resize', compute, opts);
    return () => {
      window.removeEventListener('scroll', compute as any);
      window.removeEventListener('resize', compute as any);
    };
  }, [ids, active]);

  const toggleTheme = () => {
    setIsAnimating(true);
    setTheme(theme === 'dark' ? 'light' : 'dark');
    setTimeout(() => setIsAnimating(false), 600);
  };

  const isDark = theme === 'dark';

  return (
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <ul className="relative flex flex-col gap-3 bg-black/30 backdrop-blur-md rounded-full p-2 border border-white/10">
        {/* Theme Toggle Button */}
        <li>
          <button
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            onClick={toggleTheme}
            className={`group relative w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 focus:scale-110 outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg ${
              isAnimating ? 'animate-pulse' : ''
            }`}
          >
            <span className={`absolute inset-0 rounded-full transition-opacity ${
              isDark 
                ? 'bg-gradient-to-br from-blue-400/40 via-indigo-400/30 to-purple-400/30' 
                : 'bg-gradient-to-br from-yellow-400/40 via-orange-400/30 to-amber-400/30'
            } blur-sm opacity-0 group-hover:opacity-100`} />
            <span className={`relative inline-flex items-center justify-center w-full h-full rounded-full bg-white/10 ring-1 transition-all duration-300 ${
              isDark ? 'ring-blue-300/80' : 'ring-yellow-300/80'
            }`}>
              <ThemeToggleIcon isDark={isDark} />
            </span>
          </button>
        </li>
        
        {/* Navigation Buttons */}
        {sections.map((s) => (
          <li key={s.id}>
            <button
              aria-label={s.label}
              className={`group relative w-10 h-10 rounded-full transition-transform duration-200 hover:scale-110 focus:scale-110 outline-none`}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/40 via-fuchsia-400/30 to-emerald-400/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className={`relative inline-flex items-center justify-center w-full h-full rounded-full bg-white/10 ring-1 ${active === s.id ? 'ring-cyan-300/80' : 'ring-white/10'}`}>
                <Icon id={s.id} active={active === s.id} />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}