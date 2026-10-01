'use client';

import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';

// 메인 히어로용 — /event 페이지에 적용한 것과 같은 톤이지만, 이미 사진+별
// 레이어가 있는 자리라 더 은은하게(투명도 낮춰 사진 위에 얹는 용도로) 조정.
export default function HeroShaderBackground() {
  return (
    <ShaderGradientCanvas
      style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.18, mixBlendMode: 'screen', pointerEvents: 'none' }}
      pixelDensity={1}
      fov={45}
    >
      <ShaderGradient
        control="props"
        type="waterPlane"
        animate="on"
        uSpeed={0.08}
        uStrength={0.7}
        uDensity={0.6}
        uFrequency={3}
        color1="#02060F"
        color2="#0c2e1a"
        color3="#2a0b1c"
        brightness={0.3}
        grain="off"
        cDistance={4.2}
        cAzimuthAngle={180}
        cPolarAngle={110}
        reflection={0.05}
        lightType="3d"
      />
    </ShaderGradientCanvas>
  );
}
