'use client';

import { Canvas } from '@react-three/fiber';
import { Preload, ScrollControls } from '@react-three/drei';
import Scene from '@/components/three/scene';
import Overlay from '@/components/ui/overlay';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Suspense } from 'react';

export default function CanvasWrapper() {
  const prefersReducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)'
  );

  return (
    <main className="w-screen h-screen fixed top-0 left-0">
      <Suspense fallback={null}>
        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 45 }}
          frameloop={prefersReducedMotion ? 'demand' : 'always'}
        >
          <ScrollControls pages={5} damping={0.2}>
            <Scene />
            <Overlay />
          </ScrollControls>
          <Preload all />
        </Canvas>
      </Suspense>
    </main>
  );
}
