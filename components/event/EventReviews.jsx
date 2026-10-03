'use client';

import { useFadeIn } from '@/hooks/useFadeIn';

const REVIEW_TILES = [
  { src: '/shop/origin/org12.png', alt: 'PIONEER Origin PLANET 제작 사례' },
  { src: '/shop/signal/sig04.png', alt: 'PIONEER Signal PLANET' },
  { src: '/shop/origin/org01.png', alt: '', blurred: true },
];

export default function EventReviews() {
  const fadeRef = useFadeIn();

  return (
    <section id="event-reviews" className="section section-dark">
      <div className="section-inner">
        <div className="section-label">Real Voices</div>
        <h2 className="event-h2">먼저 만나본 사람들</h2>
        <p className="event-sub-copy">당신의 이야기가 하나의 PLANET이 되기까지.</p>
        <div className="event-reviews-grid fade-in" ref={fadeRef}>
          {REVIEW_TILES.map((tile, i) =>
            tile.blurred ? (
              <div key={i} className="event-review-img event-review-teaser">
                <img src={tile.src} alt="" aria-hidden="true" />
                <div className="event-review-teaser-text">당신의 행성은?</div>
              </div>
            ) : (
              <div key={i} className="event-review-img">
                <img src={tile.src} alt={tile.alt} />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
