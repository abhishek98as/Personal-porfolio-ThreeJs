import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Float, Environment } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type ProjectCardProps = {
  title: string;
  description: string;
  url?: string;
  language?: string;
  stars?: number;
  lastUpdated?: string;
};

function Diorama({ hovered }: { hovered: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, hovered ? 0.35 : 0.0, 0.08);
    ref.current.position.y = Math.sin(t / 1.6) * 0.05;
  });
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: '#60a5fa', metalness: 0.5, roughness: 0.3 }), []);
  return (
    <Float floatIntensity={1} rotationIntensity={0.6}>
      <group ref={ref}>
        <mesh castShadow position={[0, 0.2, 0]}>
          <boxGeometry args={[1.6, 1, 0.1]} />
          <meshStandardMaterial color="#111827" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, -0.3, 0]}>
          <boxGeometry args={[1.6, 0.1, 1]} />
          <meshStandardMaterial color="#0ea5e9" roughness={0.6} />
        </mesh>
        <mesh castShadow position={[0.6, 0.2, 0.35]}>
          <torusKnotGeometry args={[0.18, 0.06, 120, 16]} />
          <primitive object={material} attach="material" />
        </mesh>
      </group>
    </Float>
  );
}

export default function ProjectCard3D({ title, description, url, language, stars, lastUpdated }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden transition-all duration-300 ${
        hovered ? 'ring-2 ring-cyan-400/50' : ''
      } ${open ? 'col-span-2 row-span-2' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setOpen((o) => !o)}
      role="button"
      aria-label={`${open ? 'Close' : 'Open'} project ${title}`}
    >
      <div className="relative h-56">
        <Canvas shadows camera={{ position: [0, 0.8, 2.2], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[2, 3, 2]} intensity={1} castShadow />
          <Environment preset="studio" />
          <Diorama hovered={hovered} />
        </Canvas>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className="p-4">
        <div className="card-gradient rounded-xl p-[1px]">
          <div className="rounded-[11px] bg-white/5 dark:bg-black/40 backdrop-blur-md p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gradient-2">{title}</h3>
              {stars !== undefined && stars > 0 && (
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {stars}
                </div>
              )}
            </div>
            <p className="text-sm text-white/80 mb-3">{description}</p>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {language && (
                  <span className="px-2 py-1 rounded-full bg-white/10 text-white/70">
                    {language}
                  </span>
                )}
                {lastUpdated && (
                  <span className="text-white/50">
                    Updated {lastUpdated}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/60">Click to {open ? 'close' : 'open'}</span>
                {url && url !== '#' && (
                  <a
                    onClick={(e) => e.stopPropagation()}
                    className="text-cyan-300 hover:underline"
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
