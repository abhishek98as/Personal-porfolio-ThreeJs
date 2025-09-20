'use client';
import { Float, Sparkles, Text3D } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

export function HeroSection() {
  const { viewport } = useThree();

  return (
    <group position={[0, viewport.height * 0, 0]}>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[viewport.width / 6, 0, -2]} castShadow>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="hsl(var(--accent))"
            roughness={0.1}
            metalness={0.9}
            emissive="hsl(var(--accent))"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      <group position={[-viewport.width / 2.5, 0.2, 0]}>
        <Text3D
          font={undefined}
          size={0.6}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          castShadow
        >
          THREEFOLIO
          <meshStandardMaterial
            color="hsl(var(--foreground))"
            emissive="hsl(var(--accent))"
            emissiveIntensity={0.1}
          />
        </Text3D>
        <Text3D
          font={undefined}
          position={[0, -0.4, 0]}
          size={0.2}
          height={0.05}
          castShadow
        >
          A 3D Developer Portfolio
          <meshStandardMaterial color="hsl(var(--foreground))" />
        </Text3D>
      </group>

      <Sparkles
        count={100}
        scale={viewport.width * 1.5}
        size={20}
        speed={0.4}
        color="hsl(var(--accent))"
      />
    </group>
  );
}
