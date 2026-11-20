"use client";

import { useFadeIn } from "@/hooks/useFadeIn";

export default function EventConcept() {
  const textFadeRef = useFadeIn();
  const imgFadeRef = useFadeIn();

  return (
    <section id="event-concept" className="section section-dark">
      <div className="section-inner">
        <div className="fade-in" ref={textFadeRef}>
          <div className="section-label">Why PIONEER</div>
          <h2 className="event-h2">
            정해진 디자인보다, <br />
            나의 좌표
          </h2>
          <p className="event-quote">
            &quot;당신의 세계는 어떤 모습인가요?&quot;
          </p>
          <p className="event-body">
            사람마다 지나온 이야기와 지금 서 있는 자리가 다릅니다. PIONEER는 그
            차이를 하나의 세계관으로 읽어내, 당신만의 좌표를 가진 PLANET으로
            옮겨 담습니다.
          </p>
          <p className="event-body">
            당신이 좋아하는 것, 마음이 머무는 순간, 스스로도 잘 몰랐던 취향까지,
            Navigator와의 대화를 통해 모으고, 그것을 하나의 디자인으로
            연결합니다.
          </p>
        </div>
        <div className="event-concept-visual fade-in" ref={imgFadeRef}>
          <div className="event-concept-img">
            <img
              src="/plaque-reveal/origin-plaque-mockup.png"
              alt="PIONEER Origin PLANET 목업"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
