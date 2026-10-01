'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import ImageSlot from '@/components/ImageSlot';

export default function EventReviews() {
  const fadeRef = useFadeIn();

  return (
    <section id="event-reviews" className="section section-dark">
      <div className="section-inner">
        <div className="section-label">Real Voices</div>
        <h2 className="event-h2">먼저 만나본 사람들</h2>
        <p className="event-sub-copy">당신의 이야기가 하나의 PLANET이 되기까지.</p>
        <div className="event-reviews-grid fade-in" ref={fadeRef}>
          {[1, 2, 3].map((i) => (
            <ImageSlot
              key={i}
              className="event-review-img"
              phVariant="ph-dark"
              label="고객 후기 이미지"
              subLines={['실제 후기 캡처 예정']}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
