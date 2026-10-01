'use client';

import { useEffect, useRef, useState } from 'react';

export default function EventStickyCta() {
  const [visible, setVisible] = useState(false);
  const ticking = useRef(false);

  // 스크롤 이벤트는 한 번 제스처에도 연속으로 여러 번 발생해서, 매번 바로
  // setState를 하면 리렌더가 과도하게 쌓일 수 있음. rAF로 묶어서 프레임당
  // 최대 한 번만 상태를 갱신하도록 함.
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight * 0.6);
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`event-sticky-cta${visible ? ' show' : ''}`}>
      <a href="#event-apply" className="btn-filled event-cta">지금 참여하기 →</a>
    </div>
  );
}
