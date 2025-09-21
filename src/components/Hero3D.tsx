import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Lightformer, Html } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Sculpture() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = Math.sin(t / 2) / 2;
    ref.current.rotation.y += 0.01;
  });
  return (
    <Float floatIntensity={1.2} rotationIntensity={0.8} speed={1.2}>
      <mesh ref={ref} castShadow receiveShadow>
        <torusKnotGeometry args={[1.1, 0.35, 220, 32]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.6} roughness={0.2} />
      </mesh>
    </Float>
  );
}

export default function Hero3D({ onViewProjects }: { onViewProjects: () => void }) {
  const webgl = typeof window !== 'undefined' && !!(document.createElement('canvas').getContext('webgl'));
  const backdropRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = backdropRef.current;
    if (!el) return;
    let raf = 0;
    let t = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = () => {
      t += 0.003;
      const x = Math.sin(t) * 10;
      const y = Math.cos(t * 0.8) * 8;
      el.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
      raf = requestAnimationFrame(animate);
    };
    if (!prefersReducedMotion) raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="relative w-full h-full">
      {/* Gradient backdrop behind the 3D canvas */}
      <div
        aria-hidden
        ref={backdropRef}
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: 'var(--gradient-bg)',
          filter: 'saturate(120%)',
          backgroundSize: '200% 200%',
          backgroundPosition: '50% 50%'
        }}
      />
      {webgl ? (
      <Canvas camera={{ position: [0, 0, 4.2], fov: 50 }} shadows>
        <ambientLight intensity={0.3} />
        <directionalLight position={[4, 5, 2]} intensity={1.2} castShadow />
        <Environment preset="city">
          <Lightformer form="ring" intensity={1} position={[0, 2, 2]} scale={[4,4,1]} />
        </Environment>
        <Sculpture />
        <OrbitControls enablePan={false} enableZoom={false} makeDefault />
      </Canvas>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-display">3D preview unavailable</h2>
            <p className="text-white/70 mt-2">Your device/browser doesn’t support WebGL. You can still browse projects below.</p>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        <h1 className="pointer-events-auto text-5xl md:text-7xl font-display font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-emerald-300 drop-shadow-lg">
          Crafting 3D-first Web Experiences
        </h1>
        <p className="pointer-events-auto mt-4 max-w-2xl text-white/80">
          Developer portfolio powered by Three.js. Smooth. Playful. Performant.
        </p>
        <div className="pointer-events-auto mt-8 flex gap-4">
          <button onClick={onViewProjects} className="px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:border-cyan-300 hover:bg-cyan-300/10 transition">
            View Projects
          </button>
          <a href="#contact" className="px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:border-emerald-300 hover:bg-emerald-300/10 transition">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}
