'use client';

import { useFadeIn } from '@/hooks/useFadeIn';

export default function PlaqueReveal() {
  const fadeRef = useFadeIn();

  return (
    <section id="plaque-reveal">
      <div className="plaque-reveal-grid">
        <div className="plaque-reveal-img" style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src="/plaque-reveal/origin-plaque-mockup.png"
            alt="The Plaque — 파이오니어 오리진 라인 폰케이스"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        <div className="plaque-reveal-text fade-in" ref={fadeRef}>
          <div className="section-label">We Made</div>
          <h2>당신이 누구인지를<br />담은 조각,<br />PLAQUE</h2>
          <p>
            폰케이스입니다. 하지만 우리는 그것을 플라크라고 부릅니다. 파이어니어 탐사선이 우주로 가져간 그
            금속판처럼, 당신이 누구인지와 어디를 향하는지를 담은 것입니다. 이것은 우주에서 단 한 개입니다.
            당신을 설명하는 디자인이니까요.
          </p>
          <a href="#shop" className="link-arrow">The Plaque 보기</a>
        </div>
      </div>
    </section>
  );
}
