'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Image as DreiImage } from '@react-three/drei';

function ScrollBackdrop() {
  const meshRef = useRef(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = Math.min(window.scrollY / window.innerHeight, 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = scrollRef.current;
    mesh.position.z = -5 - t * 10;
    mesh.material.opacity = 1 - t * 0.9;
  });

  return (
    <DreiImage ref={meshRef} url="/hero/hero-bg.jpg" position={[0, 0, -5]} scale={[26, 26]} transparent />
  );
}

export default function Hero3D() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ScrollBackdrop />
        </Suspense>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
      </Canvas>
    </div>
  );
}
