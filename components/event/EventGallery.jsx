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

export default function EventGallery() {
  const fadeRef = useFadeIn();

  return (
    <section id="event-gallery" className="section">
      <div className="section-inner">
        <div className="section-label">Archive</div>
        <h2 className="event-h2">먼저 만들어진 행성들</h2>
        <p className="event-sub-copy">각자의 이야기가 좌표와 만난 기록이에요.</p>
      </div>
      <div className="event-gallery-scroll fade-in" ref={fadeRef}>
        {GALLERY_IMAGES.map((src) => (
          <img key={src} src={src} alt="PIONEER Origin PLANET 제작 사례" className="event-gallery-img" />
        ))}
      </div>
    </section>
  );
}
