import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-theme-lg ring-1 ring-[color:var(--border)] bg-[color:var(--bg-card)]">
        {/* Header with contact details */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-black/30 backdrop-blur-md">
          <div className="flex flex-col text-sm">
            <span><span className="opacity-70">Address:</span> 123 Cosmos Ave, Milky Way</span>
            <span><span className="opacity-70">Email:</span> you@example.com</span>
            <span><span className="opacity-70">Phone:</span> +1 (555) 123-4567</span>
            <span><span className="opacity-70">Website:</span> yoursite.com</span>
          </div>
          <button onClick={onClose} className="rounded-md px-3 py-1 bg-white/10 hover:bg-white/20">Close</button>
        </div>
        <div className="grid md:grid-cols-2">
          {/* 3D Illustration Panel */}
          <div className="relative min-h-[320px]">
            <Canvas camera={{ position: [0, 0, 3.2], fov: 55 }} dpr={[1, 2]}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[3, 4, 2]} intensity={1.2} castShadow />
              <Environment preset="city" />
              <Float floatIntensity={1} rotationIntensity={0.5}>
                <HoloObject />
              </Float>
            </Canvas>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
          </div>
          {/* Form Panel */}
          <ContactForm onClose={onClose} />
        
        </div>
      </div>
    </div>
  );
}

function HoloObject() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y += 0.01;
    ref.current.position.y = Math.sin(t) * 0.1;
  });
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8b5cf6',
    metalness: 0.8,
    roughness: 0.2,
    emissive: new THREE.Color('#8b5cf6'),
    emissiveIntensity: 0.2,
  }), []);
  return (
    <mesh ref={ref} castShadow>
      <icosahedronGeometry args={[0.9, 1]} />
      <primitive attach="material" object={mat} />
    </mesh>
  );
}

function ContactForm({ onClose }: { onClose: () => void }) {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!values.name.trim()) return 'Please enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return 'Please enter a valid email';
    if (!values.subject.trim()) return 'Please enter a subject';
    if (!values.message.trim()) return 'Please enter a message';
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setStatus('submitting');

    try {
      const endpoint = (import.meta as any).env?.VITE_CONTACT_ENDPOINT as string | undefined;
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error('Request failed');
      } else {
        // Simulate success if no endpoint configured
        await new Promise((r) => setTimeout(r, 900));
      }
      setStatus('success');
      setTimeout(() => onClose(), 800);
    } catch (err) {
      setStatus('error');
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4">
      <div>
        <label className="text-sm opacity-80" htmlFor="name">Name</label>
        <input name="name" id="name" value={values.name} onChange={onChange} className="mt-1 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]" placeholder="Your name" />
      </div>
      <div>
        <label className="text-sm opacity-80" htmlFor="email">Email</label>
        <input name="email" id="email" type="email" value={values.email} onChange={onChange} className="mt-1 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]" placeholder="you@example.com" />
      </div>
      <div>
        <label className="text-sm opacity-80" htmlFor="subject">Subject</label>
        <input name="subject" id="subject" value={values.subject} onChange={onChange} className="mt-1 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]" placeholder="How can I help?" />
      </div>
      <div>
        <label className="text-sm opacity-80" htmlFor="message">Message</label>
        <textarea name="message" id="message" rows={5} value={values.message} onChange={onChange} className="mt-1 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]" placeholder="Tell me more..." />
      </div>
      {error && <div className="text-sm text-red-400">{error}</div>}
      <div className="pt-2 flex gap-3 items-center">
        <button disabled={status==='submitting'} type="submit" className="px-5 py-2 rounded-md bg-[color:var(--accent-primary)] text-white hover:opacity-90 disabled:opacity-60">
          {status==='submitting' ? 'Sending…' : status==='success' ? 'Sent!' : 'Send'}
        </button>
        {status==='error' && <span className="text-sm opacity-80">Please try again.</span>}
      </div>
    </form>
  );
}