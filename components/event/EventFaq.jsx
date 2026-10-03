"use client";

import { useState } from "react";
import { useFadeIn } from "@/hooks/useFadeIn";

const FAQS = [
  {
    q: "정말 무료로 진행되나요?",
    a: "네, 맞습니다! 저희 브랜드의 첫 시작인 만큼, PIONEER를 직접 경험해 보고 진솔한 이야기를 나누어 주실 분들을 모시기 위해 기획한 이벤트예요. 오픈을 기념으로 솔직한 후기와 경험담을 모아 브랜드의 첫 출발점으로 삼고자 마련했기에, 선정된 분들께 감사한 마음을 담아 무료로 제작해 드립니다.",
  },
  {
    q: "디자인은 어떻게 만들어지나요?",
    a: "사전 신청 시 선택하신 취향과 키워드는 나만의 우주를 찾아가는 출발점이 됩니다. 최종 디자인은 Navigator와 편안하게 나누는 세션 속에서 개인의 고유한 이야기와 좌표를 발견해 옮겨 담기에, 세상 그 어디에도 없는 나만의 PLANET이 탄생합니다.",
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  const fadeRef = useFadeIn();
  return (
    <div
      className="event-qa-item fade-in"
      data-open={isOpen || undefined}
      ref={fadeRef}
    >
      <button type="button" className="event-qa-q" onClick={onToggle}>
        <span>{item.q}</span>
        <span className="event-qa-plus">+</span>
      </button>
      <div className="event-qa-a">
        <div className="event-qa-a-inner">{item.a}</div>
      </div>
    </div>
  );
}

export default function EventFaq() {
  const [open, setOpen] = useState(null);

  return (
    <section id="event-faq" className="section">
      <div className="section-inner">
        <div className="section-label">Q & A</div>
        <h2 className="event-h2">자주 묻는 질문</h2>
        {FAQS.map((item, i) => (
          <FaqItem
            item={item}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
            key={item.q}
          />
        ))}
      </div>
    </section>
  );
}
