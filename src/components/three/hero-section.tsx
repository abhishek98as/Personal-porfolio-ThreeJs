'use client';

import { Suspense, useMemo } from 'react';
import { Float, Sparkles, Text3D } from '@react-three/drei';
import { useLoader, useThree } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as THREE from 'three';

function Title() {
  const { viewport } = useThree();
  const font = useLoader(
    FontLoader,
    '/fonts/helvetiker_regular.typeface.json'
  );

  const textOptions = useMemo(() => {
    if (!font) return null;
    return {
      font: font,
      size: 0.6,
      height: 0.1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    };
  }, [font]);

  const subTextOptions = useMemo(() => {
    if (!font) return null;
    return {
      font: font,
      size: 0.2,
      height: 0.05,
    };
  }, [font]);

  if (!textOptions) {
    // Fallback while font is loading
    return (
      <mesh position={[-viewport.width / 2.5, 0.2, 0]}>
        <boxGeometry args={[4, 0.6, 0.1]} />
        <meshStandardMaterial color="hsl(var(--muted))" emissive="black" />
      </mesh>
    );
  }

  return (
    <group position={[-viewport.width / 2.5, 0.2, 0]}>
      <Text3D {...textOptions} castShadow>
        THREEFOLIO
        <meshStandardMaterial
          color="hsl(var(--foreground))"
          emissive="hsl(var(--accent))"
          emissiveIntensity={0.1}
        />
      </Text3D>
      <Text3D position={[0, -0.4, 0]} {...subTextOptions} castShadow>
        A 3D Developer Portfolio
        <meshStandardMaterial color="hsl(var(--foreground))" />
      </Text3D>
    </group>
  );
}


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

      <Suspense fallback={null}>
        <Title />
      </Suspense>

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
