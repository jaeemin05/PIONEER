"use client";

import { useFadeIn } from "@/hooks/useFadeIn";

const CASES = [
  {
    tag: "CASE 01",
    story:
      "늘 바쁘게 움직이지만, 마음 한 켠은 조용한 궤도를 그리워하던 사람.\n멈추지 않으면서도 쉴 수 있는 자리를 원했어요.",
    result:
      "→ 은하수를 가로지르는 궤적과, 그 안에 홀로 떠 있는 작은 행성 하나로 완성.",
  },
  {
    tag: "CASE 02",
    story:
      "여러 목소리 속에서 자신의 방향을 자주 잃던 사람.\n흔들리지 않는 단 하나의 좌표를 갖고 싶어 했어요.",
    result:
      "→ 짙은 남색 우주 위에 선명하게 찍힌 좌표 하나와, 그 곁을 지키는 작은 위성으로 완성.",
  },
];

function CaseCard({ c }) {
  const fadeRef = useFadeIn();
  return (
    <div className="event-case-card event-coord-frame fade-in" ref={fadeRef}>
      <div className="event-case-tag">{c.tag}</div>
      <p>{c.story}</p>
      <div className="event-case-result">{c.result}</div>
    </div>
  );
}

export default function EventCase() {
  return (
    <section id="event-case" className="section">
      <div className="section-inner">
        <div className="section-label">What We Make</div>
        <h2 className="event-h2">
          당신의 이야기가 <br />
          디자인이 돼요
        </h2>
        <p className="event-sub-copy">
          같은 PLANET은 하나도 없어요. 사람마다 가진 좌표가 다르면, 담기는
          세계도 달라지니까요.
        </p>
        {CASES.map((c) => (
          <CaseCard c={c} key={c.tag} />
        ))}
      </div>
    </section>
  );
}
