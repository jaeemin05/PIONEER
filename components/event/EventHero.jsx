'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import EventShaderBackground from './EventShaderBackground';

export default function EventHero() {
  const fadeRef = useFadeIn();

  return (
    <section id="event-hero">
      <EventShaderBackground />
      <a href="/" className="event-logo">PIONEER</a>
      <div className="event-tag">Origin Session Preview</div>
      <h1 className="event-h1">
        나만의 <span style={{ color: 'var(--pink)' }}>행성</span>을
        <br />
        단 하나뿐인 PLANET으로
      </h1>
      <p className="event-sub">
        당신의 이야기와 취향을 발견하고
        <br />
        세상에 하나뿐인 PLANET으로 옮겨 담습니다.
      </p>

      <div className="event-promo-card event-coord-frame fade-in" ref={fadeRef}>
        <div className="event-promo-headline">오픈 기념 이벤트</div>
        <div className="event-promo-cond">
          선착순 30명 · Origin 세션 10% 할인
          <br />
          (예시 문구 · 실제 이벤트 내용으로 교체 필요)
        </div>
        <a href="#event-apply" className="btn-filled event-cta">지금 참여하기 →</a>
      </div>
    </section>
  );
}
