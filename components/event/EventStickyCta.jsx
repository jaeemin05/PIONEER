'use client';

import { useEffect, useState } from 'react';

export default function EventStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`event-sticky-cta${visible ? ' show' : ''}`}>
      <a href="#event-apply" className="btn-filled event-cta">지금 참여하기 →</a>
    </div>
  );
}
