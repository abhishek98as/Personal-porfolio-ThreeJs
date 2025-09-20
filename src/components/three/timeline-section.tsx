'use client';
import { Text, RoundedBox, useCursor } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useState } from 'react';
import { timelineData } from '@/lib/data';

function TimelineNode({ position, year, title, description, isLast }) {
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

  return (
    <group
      position={position}
      onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
      onPointerOut={() => setHover(false)}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? 'hsl(var(--accent))' : 'white'}
          emissive={hovered ? 'hsl(var(--accent))' : 'black'}
        />
      </mesh>
      <Text
        position={[0.3, 0, 0]}
        anchorX="left"
        fontSize={0.2}
        castShadow
      >
        {year}
      </Text>
      <group position={[isLast ? 0.3 : -0.3, 0, 0]} visible={hovered}>
        <group rotation={[0, isLast ? 0 : Math.PI, 0]}>
          <RoundedBox
            args={[2, 0.8, 0.1]}
            position={[1.2, 0, -0.2]}
            radius={0.05}
            castShadow
          >
            <meshStandardMaterial color="hsl(var(--card))" />
          </RoundedBox>
          <Text
            position={[0.4, 0.2, -0.1]}
            fontSize={0.15}
            anchorX="left"
          >
            {title}
          </Text>
          <Text
            position={[0.4, -0.1, -0.1]}
            fontSize={0.1}
            maxWidth={1.6}
            anchorX="left"
            lineHeight={1.4}
          >
            {description}
          </Text>
        </group>
      </group>
    </group>
  );
}

export function TimelineSection() {
  const { viewport } = useThree();
  const spacing = 1.5;

  return (
    <group position={[0, -viewport.height * 3, 0]}>
      <Text
        position={[0, viewport.height / 2.5, -1]}
        fontSize={0.5}
        anchorX="center"
        castShadow
      >
        EXPERIENCE
        <meshStandardMaterial color="hsl(var(--foreground))" />
      </Text>

      <mesh position={[-viewport.width / 4, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.01, 0.01, 5, 8]} />
        <meshStandardMaterial color="hsl(var(--border))" />
      </mesh>

      {timelineData.map((item, index) => (
        <TimelineNode
          key={index}
          position={[-viewport.width / 4, 1.5 - index * spacing, 0]}
          isLast={index === timelineData.length - 1}
          {...item}
        />
      ))}
    </group>
  );
}
