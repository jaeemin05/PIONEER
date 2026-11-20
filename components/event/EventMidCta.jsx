"use client";

import { useEventApply } from "./EventApplyContext";

import { useFadeIn } from "@/hooks/useFadeIn";

export default function EventMidCta() {
  const fadeRef = useFadeIn();
  const { open, copy } = useEventApply();

  return (
    <section id="event-mid-cta" className="section section-dark">
      <div className="section-inner event-mid-cta-inner fade-in" ref={fadeRef}>
        <p>
          당신의 이야기도 하나의 PLANET이 될 수 있어요
          <br />
          {copy.name}으로 폰케이스 무료 제작 이벤트 신청을 받고 있어요.
        </p>
        <button type="button" className="btn-filled event-cta" onClick={open}>
          지금 참여하기 →
        </button>
      </div>
    </section>
  );
}
