'use client';

import { useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import { HeroSection } from './hero-section';
import { ProjectsSection } from './projects-section';
import { SkillsSection } from './skills-section';
import { TimelineSection } from './timeline-section';
import { ContactSection } from './contact-section';
import {
  Bloom,
  EffectComposer,
  Vignette,
} from '@react-three/postprocessing';
import { useMediaQuery } from '@/hooks/use-media-query';

export default function Scene() {
  const scroll = useScroll();
  const { camera, viewport } = useThree();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useFrame((state, delta) => {
    if (prefersReducedMotion) return;

    const section = scroll.offset * (scroll.pages - 1);
    easing.damp3(
      state.camera.position,
      [0, -section * viewport.height, 5],
      0.3,
      delta
    );
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <group>
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <TimelineSection />
        <ContactSection />
      </group>

      {!prefersReducedMotion && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.4}
            luminanceSmoothing={0.9}
            height={300}
            intensity={0.7}
          />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>
      )}
    </>
  );
}
