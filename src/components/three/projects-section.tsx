'use client';
import { Image, RoundedBox, Text, useCursor } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { easing } from 'maath';
import { projectsData } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function ProjectCard({ position, project, activeProject, setActiveProject }) {
  const ref = useRef();
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

  const isActive = activeProject === project.id;

  const imageUrl = useMemo(() => {
    return PlaceHolderImages.find((img) => img.id === project.imageId)
      ?.imageUrl;
  }, [project.imageId]);

  useFrame((state, delta) => {
    const targetScale = isActive ? 1.5 : hovered ? 1.1 : 1;
    easing.damp3(
      ref.current.scale,
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.2,
      delta
    );

    const targetPosition = isActive
      ? new THREE.Vector3(0, -0.5, 2)
      : new THREE.Vector3().fromArray(position);
    easing.damp3(ref.current.position, targetPosition, 0.3, delta);
  });

  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
      onPointerOut={() => setHover(false)}
      onClick={(e) => {
        e.stopPropagation();
        setActiveProject(isActive ? null : project.id);
      }}
    >
      <RoundedBox args={[2, 1.2, 0.1]} radius={0.05} castShadow receiveShadow>
        <meshStandardMaterial
          color={hovered ? 'hsl(var(--accent))' : 'hsl(var(--primary))'}
        />
      </RoundedBox>
      {imageUrl && (
        <Image
          url={imageUrl}
          scale={[1.8, 1]}
          position={[0, 0.05, 0.06]}
          alt={project.title}
          data-ai-hint={
            PlaceHolderImages.find((img) => img.id === project.imageId)
              ?.imageHint
          }
        />
      )}
      <Text
        position={[0, -0.4, 0.07]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Space_Grotesk_Bold.json"
      >
        {project.title.toUpperCase()}
      </Text>
    </group>
  );
}

export function ProjectsSection() {
  const { viewport } = useThree();
  const [activeProject, setActiveProject] = useState(null);
  const spacing = 3;
  const projectsCount = projectsData.length;
  const totalWidth = projectsCount * spacing;

  return (
    <group position={[0, -viewport.height * 1, 0]}>
      <Text
        position={[0, viewport.height / 2.5, -1]}
        fontSize={0.5}
        font="/fonts/Space_Grotesk_Bold.json"
        anchorX="center"
        castShadow
      >
        PROJECTS
        <meshStandardMaterial color="hsl(var(--foreground))" />
      </Text>
      <group onClick={() => setActiveProject(null)}>
        {projectsData.map((project, index) => (
          <ProjectCard
            key={index}
            position={[
              -totalWidth / 3 + index * spacing,
              -0.5,
              activeProject ? -1 : 0,
            ]}
            project={project}
            activeProject={activeProject}
            setActiveProject={setActiveProject}
          />
        ))}
      </group>
    </group>
  );
}
