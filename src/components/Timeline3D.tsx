import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';

type Item = {
  title: string;
  company: string;
  period: string;
  summary: string;
};

const items: Item[] = [
  { title: 'Senior Frontend Engineer', company: 'Acme Inc.', period: '2023 — Present', summary: 'Led 3D UX initiatives and performance tuning.' },
  { title: 'Frontend Engineer', company: 'Beta Labs', period: '2021 — 2023', summary: 'Built interactive data viz and design system.' },
  { title: 'Freelance', company: 'Various', period: '2019 — 2021', summary: 'Worked on creative web experiences.' },
];

function Timeline() {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 6, 16]} />
        <meshStandardMaterial color="#93c5fd" />
      </mesh>
      {items.map((it, i) => {
        const y = 2.2 - i * 2.2;
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#a78bfa" />
            </mesh>
            <Html position={[0.4, 0, 0]} transform distanceFactor={3}>
              <div className="bg-black/60 border border-white/10 rounded-lg p-3 w-64">
                <div className="text-sm text-white/60">{it.period}</div>
                <div className="font-semibold">{it.title}</div>
                <div className="text-white/80">{it.company}</div>
                <p className="mt-1 text-sm text-white/70">{it.summary}</p>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function Timeline3D() {
  return (
    <div className="mt-8 h-[520px] rounded-2xl overflow-hidden border border-white/10 bg-black/30">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 3, 2]} intensity={1} />
        <Timeline />
      </Canvas>
    </div>
  );
}
