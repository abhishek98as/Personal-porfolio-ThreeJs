'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@react-three/drei';

const CanvasWrapper = dynamic(
  () => import('@/components/canvas-wrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen flex items-center justify-center bg-background">
        <Loader />
      </div>
    ),
  }
);

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center bg-background">
          <Loader />
        </div>
      }
    >
      <CanvasWrapper />
    </Suspense>
  );
}
