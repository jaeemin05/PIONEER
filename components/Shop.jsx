'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { useSessionModal } from './SessionModalContext';
import ShopCarousel from './ShopCarousel';

const SIGNAL_ITEMS = [
  { img: '/shop/signal/sig01.png', label: 'Signal 01', sub: '스테이션 그래픽 플라크', coord: 'SIG-01 · Station' },
  { img: '/shop/signal/sig02.png', label: 'Signal 02', sub: '우주인 콜라주 플라크', coord: 'SIG-02 · Astronaut' },
  { img: '/shop/signal/sig03.png', label: 'Signal 03', sub: '파이오니어 플라크 그래픽', coord: 'SIG-03 · The Plaque' },
  { img: '/shop/signal/sig04.png', label: 'Signal 04', sub: '콘텐츠 추가 예정', coord: 'SIG-04' },
  { img: '/shop/signal/sig05.png', label: 'Signal 05', sub: '콘텐츠 추가 예정', coord: 'SIG-05' },
  { img: '/shop/signal/sig06.png', label: 'Signal 06', sub: '콘텐츠 추가 예정', coord: 'SIG-06' },
  { img: '/shop/signal/sig07.png', label: 'Signal 07', sub: '콘텐츠 추가 예정', coord: 'SIG-07' },
  { img: '/shop/signal/sig08.png', label: 'Signal 08', sub: '콘텐츠 추가 예정', coord: 'SIG-08' },
  { img: '/shop/signal/sig09.png', label: 'Signal 09', sub: '콘텐츠 추가 예정', coord: 'SIG-09' },
];

const ORIGIN_ITEMS = [
  { img: '/shop/origin/org01.png', label: 'Origin 예시 01', sub: '실제 제작된 커스텀 플라크', coord: 'ORI-01 · 누군가의 별' },
  { img: '/shop/origin/org02.png', label: 'Origin 예시 02', sub: '실제 제작된 커스텀 플라크', coord: 'ORI-02 · 누군가의 별' },
  { img: '/shop/origin/org03.png', label: 'Origin 예시 03', sub: '실제 제작된 커스텀 플라크', coord: 'ORI-03 · 누군가의 별' },
  { img: '/shop/origin/org04.png', label: 'Origin 예시 04', sub: '실제 제작된 커스텀 플라크', coord: 'ORI-04 · 누군가의 별' },
  { img: '/shop/origin/org05.png', label: 'Origin 예시 05', sub: '실제 제작된 커스텀 플라크', coord: 'ORI-05 · 누군가의 별' },
  { img: '/shop/origin/org06.png', label: 'Origin 예시 06', sub: '실제 제작된 커스텀 플라크', coord: 'ORI-06 · 누군가의 별' },
  { img: '/shop/origin/org07.png', label: 'Origin 예시 07', sub: '실제 제작된 커스텀 플라크', coord: 'ORI-07 · 누군가의 별' },
  { img: '/shop/origin/org08.png', label: 'Origin 예시 08', sub: '실제 제작된 커스텀 플라크', coord: 'ORI-08 · 누군가의 별' },
  { img: '/shop/origin/org09.png', label: 'Origin 예시 09', sub: '실제 제작된 커스텀 플라크', coord: 'ORI-09 · 누군가의 별' },
  { img: '/shop/origin/org10.png', label: 'Origin 예시 10', sub: '실제 제작된 커스텀 플라크', coord: 'ORI-10 · 누군가의 별' },
  { img: '/shop/origin/org11.png', label: 'Origin 예시 11', sub: '실제 제작된 커스텀 플라크', coord: 'ORI-11 · 누군가의 별' },
  { img: '/shop/origin/org12.png', label: 'Origin 예시 12', sub: '실제 제작된 커스텀 플라크', coord: 'ORI-12 · 누군가의 별' },
  { img: '/shop/origin/org13.png', label: 'Origin 예시 13', sub: '실제 제작된 커스텀 플라크', coord: 'ORI-13 · 누군가의 별' },
  { img: '/shop/origin/org14.png', label: 'Origin 예시 14', sub: '실제 제작된 커스텀 플라크', coord: 'ORI-14 · 누군가의 별' },
];

export default function Shop() {
  const signalHeaderFade = useFadeIn();
  const dividerFade = useFadeIn();
  const originHeaderFade = useFadeIn();
  const { open } = useSessionModal();

  return (
    <section id="shop" className="section">
      <div className="section-inner">
        <div className="section-label">The Plaque</div>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(32px,4.5vw,60px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          두 가지 방법으로<br />당신의 별을 담습니다.
        </h2>

        <div className="lineup-header fade-in" ref={signalHeaderFade}>
          <div className="lineup-tag">Signal</div>
          <div className="lineup-info">
            <span className="lineup-title">SIGNAL</span>
            <span className="lineup-desc">
              스테이션, 우주인, 플라크 — PIONEER 세계관을 담은 기성 라인입니다. 고르면 됩니다.
            </span>
          </div>
          <a href="#" className="btn-outline lineup-btn">전체 보기</a>
        </div>

        <ShopCarousel items={SIGNAL_ITEMS} />

        <div className="lineup-divider fade-in" ref={dividerFade} />

        <div className="lineup-header fade-in" ref={originHeaderFade}>
          <div className="lineup-tag origin">Origin</div>
          <div className="lineup-info">
            <span className="lineup-title">ORIGIN</span>
            <span className="lineup-desc">
              Navigator와의 대화로 만들어지는 단 하나의 Plaque입니다. 나의 World, Moment, Coordinates로.
            </span>
          </div>
          <a
            href="#"
            className="btn-filled lineup-btn"
            onClick={(e) => { e.preventDefault(); open(); }}
          >
            나의 Plaque 만들기
          </a>
        </div>

        <ShopCarousel items={ORIGIN_ITEMS} />
      </div>
    </section>
  );
}
