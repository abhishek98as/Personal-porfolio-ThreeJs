import { useEffect } from 'react';

export default function ResumeModal({ open, onClose, src = '/resume.pdf' }: { open: boolean; onClose: () => void; src?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden shadow-theme-lg ring-1 ring-[color:var(--border)] bg-[color:var(--bg-card)]">
        <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between bg-black/30 backdrop-blur-md gap-2">
          <div className="font-semibold">Resume</div>
          <div className="flex items-center gap-2">
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="rounded-md px-3 py-1 bg-white/10 hover:bg-white/20"
            >
              Open in new tab
            </a>
            <a
              href={src}
              download
              className="rounded-md px-3 py-1 bg-white/10 hover:bg-white/20"
            >
              Download
            </a>
            <button onClick={onClose} className="rounded-md px-3 py-1 bg-white/10 hover:bg-white/20">Close</button>
          </div>
        </div>
        <iframe title="Resume" src={src} className="w-full h-full" />
      </div>
    </div>
  );
}