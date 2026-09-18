'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import ImageSlot from './ImageSlot';

const PILLARS = [
  {
    img: '/system/World.jpg',
    label: 'World 예시 Plaque',
    sub: '세계관이 강하게 느껴지는 디자인',
    title: 'World',
    desc: '그 별이 어떤 세계인지입니다. 광활하거나, 좁고 깊거나, 복잡하거나, 텅 비어있습니다.',
  },
  {
    img: '/system/Moment.jpg',
    label: 'Moment 예시 Plaque',
    sub: '우주인의 행동이 강하게 느껴지는 디자인',
    title: 'Moment',
    desc: '우주인이 그 별에서 무엇을 하는지입니다. 무언가를 향해 달려가거나, 처음으로 멈춰있거나.',
  },
  {
    img: '/system/Coordinates.jpg',
    label: 'Coordinates 디테일',
    sub: 'The Plaque 하단 좌표 클로즈업',
    title: 'Coordinates',
    desc: '그 별의 좌표입니다. 날짜, 위치, 번호. 세상에 하나뿐인 것입니다.',
  },
];

export default function SystemSection() {
  const fadeRef = useFadeIn();

  return (
    <section id="system" className="section section-dark">
      <div className="section-inner">
        <div className="section-label">The Plaque</div>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(18px,3.2vw,52px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            whiteSpace: 'nowrap',
          }}
        >
          World · Moment · Coordinates
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-dim)', maxWidth: '480px', lineHeight: 1.85 }}>
          고객의 별은 분류되지 않습니다. 유형이 없습니다. 같은 별은 없습니다.
        </p>

        <div className="system-grid fade-in" ref={fadeRef}>
          {PILLARS.map((pillar) => (
            <div key={pillar.title}>
              <ImageSlot className="system-img" src={pillar.img} alt={pillar.label} label={pillar.label} subLines={[pillar.sub]} />
              <div className="system-title">{pillar.title}</div>
              <p className="system-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>

        <p className="system-note">같은 세계여도 다른 순간이 있습니다. 같은 순간이어도 다른 세계가 있습니다.</p>
      </div>
    </section>
  );
}
