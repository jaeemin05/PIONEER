'use client';

import { useFadeIn } from '@/hooks/useFadeIn';

const GALLERY_IMAGES = [
  '/shop/origin/org01.png',
  '/shop/origin/org02.png',
  '/shop/origin/org03.png',
  '/shop/origin/org04.png',
  '/shop/origin/org05.png',
  '/shop/origin/org06.png',
];

// 자동으로 흘러가는 무한 슬라이드 — 목록을 두 번 이어 붙이고 CSS로 트랙을 -50%까지
// 옮겼다가 처음으로 돌려서 이음새 없이 반복. 두 번째 묶음은 보조기기에 중복으로 안 읽히게 숨김.
const TRACK = [...GALLERY_IMAGES, ...GALLERY_IMAGES];

export default function EventGallery() {
  const fadeRef = useFadeIn();

  return (
    <section id="event-gallery" className="section">
      <div className="section-inner">
        <div className="section-label">Archive</div>
        <h2 className="event-h2">먼저 만들어진 행성들</h2>
        <p className="event-sub-copy">각자의 이야기가 좌표와 만난 기록이에요.</p>
      </div>
      <div className="event-gallery-marquee fade-in" ref={fadeRef}>
        <div className="event-gallery-track">
          {TRACK.map((src, i) => {
            const isCopy = i >= GALLERY_IMAGES.length;
            return (
              <img
                key={i}
                src={src}
                alt={isCopy ? '' : 'PIONEER Origin PLANET 제작 사례'}
                aria-hidden={isCopy || undefined}
                className="event-gallery-img"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
