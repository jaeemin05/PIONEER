"use client";

import { useFadeIn } from "@/hooks/useFadeIn";
import ImageSlot from "./ImageSlot";

const SYSTEM_IMG = "/system/System.jpg";

const PILLARS = [
  {
    title: "Explore",
    desc: "넓은 우주 어딘가에 나만의 행성이 있어요. 내가 좋아하는 것, 마음이 반짝이는 순간들. 그 행성을 찾기 위한 단서를 하나씩 모아봐요",
  },
  {
    title: "Navigate",
    desc: "모은 단서들을 따라 길을 찾아요. Navigator와 함께 우주 지도를 펼치고 나의 행성이 어디에 있는지 찾아가요",
  },
  {
    title: "Launch",
    desc: "드디어 나의 행성을 향해 출발해요. 누구와도 같지 않은 나만의 행성이 하나의 모습으로 태어나요",
  },
];

export default function SystemSection() {
  const imgFadeRef = useFadeIn();
  const gridFadeRef = useFadeIn();

  return (
    <section id="system" className="section section-dark">
      <div className="section-inner">
        <div className="section-label">The PLANET</div>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(18px,3.2vw,52px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "16px",
            whiteSpace: "nowrap",
          }}
        >
          Explore · Navigate · Launch
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "var(--text-dim)",
            maxWidth: "480px",
            lineHeight: 1.85,
          }}
        >
          고객의 행성은 분류되지 않습니다. 유형이 없습니다. 같은 행성은
          없습니다.
        </p>

        <ImageSlot
          className="system-banner fade-in"
          fadeRef={imgFadeRef}
          src={SYSTEM_IMG}
          alt="Explore · Navigate · Launch"
          label="Explore · Navigate · Launch"
        />

        <div className="system-grid fade-in" ref={gridFadeRef}>
          {PILLARS.map((pillar) => (
            <div key={pillar.title}>
              <div className="system-title">{pillar.title}</div>
              <p className="system-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>

        <p className="system-note">
          같은 세계여도 다른 순간이 있습니다. 같은 순간이어도 다른 세계가
          있습니다.
        </p>
      </div>
    </section>
  );
}
