import { useState } from 'react';
import ResumeModal from '../components/ResumeModal';
import ContactModal from '../components/ContactModal';

export default function Contact() {
  const [openResume, setOpenResume] = useState(false);
  const [openContact, setOpenContact] = useState(false);
  return (
    <div className="container mx-auto px-6">
      <div className="rounded-3xl panel-gradient p-8 ring-1 ring-[color:var(--border)]">
        <h2 className="text-3xl md:text-5xl font-display font-semibold text-gradient-2">Contact</h2>
        <p className="mt-4 text-[color:var(--fg-secondary)]">Reach out or grab my resume.</p>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="group perspective">
            <div className="relative h-56 rounded-2xl card-gradient transition-transform duration-500 group-hover:rotate-y-6" style={{ transformStyle: 'preserve-3d' }}>
              <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(30px)' }}>
                <div className="text-center">
                  <div className="text-xl font-semibold">Your Name</div>
                  <div className="text-[color:var(--fg-secondary)]">Frontend • 3D Web</div>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 flex gap-3" style={{ transform: 'translateZ(10px)' }}>
                <button className="px-3 py-1 rounded-full border border-white/20 hover:border-cyan-300" onClick={() => setOpenContact(true)}>Contact</button>
                <button onClick={() => setOpenResume(true)} className="px-3 py-1 rounded-full border border-white/20 hover:border-emerald-300">Resume</button>
              </div>
            </div>
          </div>
          <div className="rounded-2xl card-gradient p-4">
            <div className="text-[color:var(--fg-secondary)] text-sm">Prefer socials?</div>
            <div className="mt-3 flex gap-4">
              <a className="hover:text-cyan-300" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
              <a className="hover:text-fuchsia-300" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="hover:text-emerald-300" href="https://twitter.com" target="_blank" rel="noreferrer">X/Twitter</a>
            </div>
          </div>
        </div>
      </div>
      <ResumeModal open={openResume} onClose={() => setOpenResume(false)} />
      <ContactModal open={openContact} onClose={() => setOpenContact(false)} />
    </div>
  );
}
