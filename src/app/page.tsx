'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, Preload, ScrollControls } from '@react-three/drei';
import Scene from '@/components/three/scene';
import Overlay from '@/components/ui/overlay';
import { useMediaQuery } from '@/hooks/use-media-query';

export default function Home() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setIsSupported(false);
    }
  }, []);

  if (!isSupported) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-background text-foreground text-center p-4">
        <div>
          <h1 className="text-2xl font-headline mb-4">WebGL Not Supported</h1>
          <p>
            Your browser does not support WebGL, which is required for the 3D
            experience.
          </p>
          <p>A 2D version of the site is coming soon.</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
        <Loader />
      </main>
    </>
  );
}
