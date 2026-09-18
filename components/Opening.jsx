'use client';

import { useFadeIn } from '@/hooks/useFadeIn';

export default function Opening() {
  const fadeRef = useFadeIn();

  return (
    <section id="opening">
      <div className="opening-text fade-in" ref={fadeRef}>
        <p className="line1">별을 팝니다,<br />케이스에 담아서.</p>
        <p className="line2">한 번도 출시된 적 없는, 당신만의 디자인으로.</p>
      </div>
    </section>
  );
}
