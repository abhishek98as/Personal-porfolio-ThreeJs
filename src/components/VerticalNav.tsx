import { useEffect, useMemo, useState } from 'react';

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
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          <path fill={active ? 'url(#g-time)' : 'currentColor'} d="M12 7a1 1 0 0 1 1 1v3.586l2.707 2.707-1.414 1.414L11 13V8a1 1 0 0 1 1-1Zm0-5a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
        </svg>
      );
    case 'playground':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <defs>
            <linearGradient id={`g-play`} x1="0" x2="1">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <path fill={active ? 'url(#g-play)' : 'currentColor'} d="M8 5v14l11-7L8 5Z" />
        </svg>
      );
    case 'contact':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <defs>
            <linearGradient id={`g-mail`} x1="0" x2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>
          </defs>
          <path fill={active ? 'url(#g-mail)' : 'currentColor'} d="M20 4H4a2 2 0 0 0-2 2v12l6-4h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
        </svg>
      );
    case 'footer':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <defs>
            <linearGradient id={`g-end`} x1="0" x2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          <path fill={active ? 'url(#g-end)' : 'currentColor'} d="M12 2v20M2 12h20" />
        </svg>
      );
    case 'prefooter':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <defs>
            <radialGradient id={`g-stars`} cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#a78bfa" />
            </radialGradient>
          </defs>
          <path fill={active ? 'url(#g-stars)' : 'currentColor'} d="M12 2l1.9 4 4.4.4-3.3 2.9.98 4.3L12 12.9 8.02 13.6l.98-4.3L5.7 6.4l4.4-.4L12 2Z" />
        </svg>
      );
    default:
      return null;
  }
};

export default function VerticalNav({ sections }: Props) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? '');
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);

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

  return (
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
  <ul className="relative flex flex-col gap-3 bg-black/30 backdrop-blur-md rounded-full p-2 border border-white/10">
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
