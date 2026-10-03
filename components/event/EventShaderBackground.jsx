'use client';

import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';

export default function EventShaderBackground() {
  return (
    <ShaderGradientCanvas
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      pixelDensity={1}
      fov={45}
      pointerEvents="none"
    >
      <ShaderGradient
        control="props"
        type="waterPlane"
        animate="off"
        uSpeed={0.1}
        uStrength={0.8}
        uDensity={0.6}
        uFrequency={3}
        color1="#02060F"
        color2="#0c1e36"
        color3="#1a1433"
        brightness={0.4}
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
