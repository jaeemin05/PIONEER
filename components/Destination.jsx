'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { useSessionModal } from './SessionModalContext';

export default function Destination() {
  const fadeRef = useFadeIn();
  const { open } = useSessionModal();

  return (
    <section id="destination">
      <div className="destination-inner fade-in" ref={fadeRef}>
        <p className="destination-line1">어디로 가고 싶은지,</p>
        <p className="destination-line2">사실 알고 있습니다.</p>
        <p className="destination-sub">아직 말로 꺼낸 적이 없을 뿐입니다.</p>
        <a
          href="#"
          className="btn-primary"
          onClick={(e) => { e.preventDefault(); open(); }}
        >
          나의 Plaque 만들기
        </a>
      </div>
    </section>
  );
}
