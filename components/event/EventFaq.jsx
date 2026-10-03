"use client";

import { useState } from "react";
import { useFadeIn } from "@/hooks/useFadeIn";

const FAQS = [
  {
    q: "정말 할인이 적용되나요?",
    a: "네. 오픈 기념으로 선정된 분들께 폰케이스 무료 제작을 제공합니다. (예시 문구 · 실제 이벤트 조건으로 교체 필요)",
  },
  {
    q: "디자인은 제가 직접 고르나요?",
    a: "사전에 고르신 키워드는 대화의 출발점이 됩니다. 최종 디자인은 Navigator와 나눈 대화와 당신의 이야기를 바탕으로 완성되기 때문에, 세상에 같은 PLANET은 없습니다.",
  },
  {
    q: "신청 후 얼마나 기다려야 하나요?",
    a: "신청해주시면 Navigator가 기재해주신 연락처로 상세 안내드립니다.",
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
