import Hero3D from './Hero3D';

export default function Hero() {
  return (
    <section id="hero">
      {/* WebGL(별 파티클 + 텍스처)이 JS/Three.js 초기화를 기다리는 동안
          체감 로딩 지연이 있어서, 같은 사진을 순수 CSS 배경으로 먼저
          깔아 즉시 보이게 함. 브라우저 캐시가 같은 URL이라 중복 다운로드
          없음 — WebGL 레이어가 준비되면 그 위에 자연스럽게 겹쳐짐. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: "url('/hero/hero-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Hero3D />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(to bottom, rgba(2,6,15,0.55) 0%, rgba(2,6,15,0.3) 50%, rgba(2,6,15,0.75) 100%)',
        }}
      />

      <div className="hero-content">
        <div className="hero-logo-text">PIONEER</div>
        <span className="hero-dot">·</span>
        <div className="hero-tagline">Go. Lightly.</div>
      </div>

      <div className="scroll-cue">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
