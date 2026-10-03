"use client";

import { useFadeIn } from "@/hooks/useFadeIn";
import EventShaderBackground from "./EventShaderBackground";
import { useEventApply } from "./EventApplyContext";

export default function EventHero() {
  const fadeRef = useFadeIn();
  const { open } = useEventApply();

  return (
    <section id="event-hero">
      <EventShaderBackground />
      <a href="/" className="event-logo">
        PIONEER
      </a>
      <div className="event-tag">Origin Session Preview</div>
      <h1 className="event-h1">
        나만의 <span style={{ color: "var(--pink)" }}>행성</span>을
        <br />단 하나뿐인 PLANET으로
      </h1>
      <p className="event-sub">
        당신의 이야기와 취향을 발견하고
        <br />
        세상에 하나뿐인 PLANET으로 옮겨 담습니다.
      </p>

      <div className="event-promo-card event-coord-frame fade-in" ref={fadeRef}>
        <div className="event-promo-headline">오픈 기념 이벤트</div>
        <div className="event-promo-title">OPEN EVENT</div>
        <div className="event-promo-eligibility">서울·경기 거주 20대 한정!</div>
        <div className="event-promo-cond">
          나의 우주를 담은 폰케이스를 디자인해드려요!
          <br />
          선착순 30명 · 커스텀 <span style={{ color: "var(--green)" }}>폰케이스</span> 제작 무료 이벤트
        </div>
        <button type="button" className="btn-filled event-cta" onClick={open}>
          지금 참여하기 →
        </button>
      </div>
    </section>
  );
}
