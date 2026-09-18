'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import ImageSlot from './ImageSlot';

const EXPERIENCE_IMG = null;

export default function Experience() {
  const imgFade = useFadeIn();
  const stepsFade = useFadeIn();

  return (
    <section id="experience" className="section">
      <div className="section-inner">
        <div className="section-label">How It Works</div>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(32px,4.5vw,60px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: '10px',
          }}
        >
          PIONEER Station
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-dim)', maxWidth: '420px', lineHeight: 1.8 }}>
          목적지가 아닌 경유지입니다. 오랜만에 멈춘 느낌이 드는 곳입니다.
        </p>

        <ImageSlot
          className="experience-img fade-in"
          fadeRef={imgFade}
          src={EXPERIENCE_IMG}
          alt="Navigator Session"
          label="Navigator Session 이미지"
          subLines={['권장: 테이블에 마주앉아 대화하는 장면, 따뜻한 조명, 가로형', '비율: 16:7 권장']}
        />

        <div className="experience-steps fade-in" ref={stepsFade}>
          <div className="exp-step">
            <span className="exp-num">01 — Stop</span>
            <div className="exp-title">멈춥니다</div>
            <p className="exp-copy">
              달려가던 우주선을 잠깐 세웁니다. PIONEER Station에 들어섭니다. 우주선의 소음이 없고,
              조용하고, 누군가 있습니다.
            </p>
          </div>
          <div className="exp-step">
            <span className="exp-num">02 — Talk</span>
            <div className="exp-title">대화합니다</div>
            <p className="exp-copy">
              Navigator와 함께 앉아 이야기를 나눕니다. 무슨 이야기를 해야 할지 몰라도 됩니다. 대화하다
              보면, 당신이 가고 싶었던 곳이 보입니다.
            </p>
          </div>
          <div className="exp-step">
            <span className="exp-num">03 — Receive</span>
            <div className="exp-title">받습니다</div>
            <p className="exp-copy">
              그 순간이 디자인이 됩니다. Navigator가 건넵니다. 당신의 World, Moment, Coordinates가 담긴
              The Plaque입니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
