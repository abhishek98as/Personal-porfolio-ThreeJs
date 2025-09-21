import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

export default function StarsCanvas() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <Stars
          radius={50}
          depth={20}
          count={2000}
          factor={4}
          saturation={0}
          fade
          speed={0.6}
        />
      </Canvas>
    </div>
  );
}
