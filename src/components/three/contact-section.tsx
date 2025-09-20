'use client';
import { Text, RoundedBox, useCursor, Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function BusinessCard() {
  const group = useRef();
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame((state, delta) => {
    easing.damp(
      group.current.rotation,
      'y',
      active ? 0 : Math.PI,
      0.25,
      delta
    );
  });

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        setActive(!active);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <group ref={group}>
        {/* Front */}
        <RoundedBox args={[2, 1.2, 0.05]} radius={0.02} position={[0, 0, 0]}>
          <meshStandardMaterial color="hsl(var(--primary))" />
          <Text
            position={[0, 0.2, 0.03]}
            fontSize={0.2}
            font={undefined}
          >
            YOUR NAME
          </Text>
          <Text position={[0, 0, 0.03]} fontSize={0.1}>
            Software Developer
          </Text>
          <Text
            position={[0, -0.3, 0.03]}
            fontSize={0.07}
            font={undefined}
          >
            {active ? 'Click to Close' : 'Click to Open'}
          </Text>
        </RoundedBox>

        {/* Back */}
        <RoundedBox
          args={[2, 1.2, 0.05]}
          radius={0.02}
          rotation-y={Math.PI}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial color="hsl(var(--primary))" />
          <Text
            position={[0, 0.3, 0.03]}
            fontSize={0.1}
            font={undefined}
          >
            CONTACT
          </Text>
          <Text position={[0, 0.1, 0.03]} fontSize={0.08}>
            dev@example.com
          </Text>
          <Text position={[0, -0.1, 0.03]} fontSize={0.08}>
            linkedin.com/in/yourprofile
          </Text>
        </RoundedBox>
      </group>
    </group>
  );
}

function ContactForm() {
  return (
    <Card className="w-80 md:w-96 border-accent backdrop-blur-sm bg-background/50">
      <CardHeader>
        <CardTitle className="font-headline">Get In Touch</CardTitle>
        <CardDescription>
          Let&apos;s build something great together.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Your Name" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Your message..." />
          </div>
          <Button type="submit" variant="default" className="bg-accent hover:bg-accent/80">
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function ContactSection() {
  const { viewport } = useThree();

  return (
    <group position={[0, -viewport.height * 4, 0]}>
      <Text
        position={[0, viewport.height / 2.5, -1]}
        fontSize={0.5}
        font={undefined}
        anchorX="center"
        castShadow
      >
        CONTACT
        <meshStandardMaterial color="hsl(var(--foreground))" />
      </Text>
      <group position={[-viewport.width / 6 - 1, -0.5, 0]}>
        <BusinessCard />
      </group>
      <Html
        position={[viewport.width / 6 + 0.5, -0.2, 0]}
        center
        transform
        occlude
      >
        <ContactForm />
      </Html>
    </group>
  );
}
