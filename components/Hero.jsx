import Hero3D from './Hero3D';

export default function Hero() {
  return (
    <section id="hero">
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
