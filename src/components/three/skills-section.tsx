'use client';

import { Text, useCursor } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { adjustSkillsOrb } from '@/ai/flows/adjust-skills-orb-based-on-llm-analysis';
import { skillsData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const projectCodeForAnalysis = `// Dummy code for analysis
import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
const App = () => (
    <Canvas>
        <mesh>
            <boxGeometry />
            <meshStandardMaterial />
        </mesh>
    </Canvas>
);
export default App;
`;
const projectDescriptionForAnalysis =
  'A portfolio showcasing projects using modern web technologies like React, Next.js, and especially Three.js for 3D graphics.';

function SkillPoint({ position, skill, prominence }) {
  const [hovered, setHover] = useState(false);
  useCursor(hovered);
  const finalProminence = useMemo(() => prominence || 0.1, [prominence]);

  return (
    <group
      position={position}
      onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
      onPointerOut={() => setHover(false)}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.05 * finalProminence * 4, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? 'hsl(var(--accent))' : 'white'}
          emissive={hovered ? 'hsl(var(--accent))' : 'black'}
          emissiveIntensity={hovered ? 0.5 : 0}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      <Text
        position={[0, -0.2 - 0.05 * finalProminence * 4, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        visible={hovered}
      >
        {skill}
      </Text>
    </group>
  );
}

export function SkillsSection() {
  const { viewport } = useThree();
  const groupRef = useRef();
  const { toast } = useToast();
  const [skills, setSkills] = useState(
    skillsData.map((s) => ({ skill: s, prominence: 0.5 }))
  );

  useEffect(() => {
    async function fetchSkillProminence() {
      try {
        toast({
          title: 'AI Analysis',
          description: 'Analyzing projects to determine skill proficiency...',
        });
        const updatedSkills = await adjustSkillsOrb({
          projectCode: projectCodeForAnalysis,
          projectDescription: projectDescriptionForAnalysis,
          skills: skillsData,
        });
        setSkills(updatedSkills);
        toast({
          title: 'AI Analysis Complete',
          description: 'Skills orb has been updated.',
        });
      } catch (error) {
        console.error('Failed to adjust skills orb:', error);
        toast({
          variant: 'destructive',
          title: 'AI Analysis Failed',
          description: 'Could not update skill prominence.',
        });
      }
    }
    fetchSkillProminence();
  }, [toast]);

  const points = useMemo(() => {
    const temp = [];
    const phi = Math.PI * (3.0 - Math.sqrt(5.0));
    for (let i = 0; i < skills.length; i++) {
      const y = 1 - (i / (skills.length - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      temp.push({
        position: [x * 2.5, y * 2.5, z * 2.5],
        ...skills[i],
      });
    }
    return temp;
  }, [skills]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group position={[0, -viewport.height * 2, 0]}>
      <Text
        position={[0, viewport.height / 2.5, -1]}
        fontSize={0.5}
        anchorX="center"
        castShadow
      >
        SKILLS
        <meshStandardMaterial color="hsl(var(--foreground))" />
      </Text>
      <group ref={groupRef}>
        {points.map((point, index) => (
          <SkillPoint
            key={index}
            position={point.position}
            skill={point.skill}
            prominence={point.prominence}
          />
        ))}
      </group>
    </group>
  );
}
