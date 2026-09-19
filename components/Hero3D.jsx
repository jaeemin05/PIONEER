'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
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
  // react-use-measure(@react-three/fiber 내부)가 프로덕션 빌드에서 마운트 시
  // ResizeObserver 최초 콜백을 못 잡아 캔버스가 기본 크기(300x150)로 굳는 문제가 있음
  // (dev에서는 React StrictMode의 effect 이중 실행이 우연히 이걸 가려줬음).
  // 마운트 직후 resize 이벤트를 한 번 더 흘려서 강제로 재측정시킴.
  useEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    return () => cancelAnimationFrame(id);
  }, []);

  // 저사양 모바일 GPU에서 스크롤 중 버벅임 — 별 개수/해상도 배율/안티앨리어싱을
  // 낮춰서 프레임당 렌더 부하를 줄임. 데스크톱은 기존 값 그대로 유지.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { setIsMobile(window.innerWidth <= 900); }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{ antialias: !isMobile, alpha: true }}
      >
        <Suspense fallback={null}>
          <ScrollBackdrop />
        </Suspense>
        <Stars radius={100} depth={50} count={isMobile ? 1800 : 5000} factor={4} saturation={0} fade speed={0.5} />
      </Canvas>
    </div>
  );
}
