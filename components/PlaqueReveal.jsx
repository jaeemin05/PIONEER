"use client";

import { useState } from "react";
import { useFadeIn } from "@/hooks/useFadeIn";

export default function PlaqueReveal() {
  const fadeRef = useFadeIn();
  const [revealed, setRevealed] = useState(false);

  return (
    <section id="plaque-reveal">
      <div className="plaque-reveal-grid">
        <div
          className="plaque-reveal-img"
          style={{ position: "relative", overflow: "hidden" }}
        >
          <img
            src="/plaque-reveal/origin-plaque-mockup.png"
            alt="The PLANET — 파이오니어 오리진 라인 폰케이스"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>

        <div className="plaque-reveal-text fade-in" ref={fadeRef}>
          <div className="section-label">We Made</div>
          <h2>
            당신이 누구인지를
            <br />
            담은 행성,
            <br />
            PLANET
          </h2>
          <p>
            ‘사람에게도 각자의 좌표가 있다면 어떨까?’
            <br />
            파이어니어 탐사선을 타고 당신만의 좌표를 찾아 떠납니다.
            <br />
            <button
              type="button"
              className={`blur-reveal${revealed ? " revealed" : ""}`}
              onClick={() => setRevealed(true)}
              aria-label={revealed ? undefined : "클릭해서 문구 보기"}
            >
              그 행성에는 무엇이 있을까요?
            </button>{" "}
            PIONEER는 그 행성을 세상에 하나뿐인 케이스로 만듭니다.
          </p>
          <a href="#shop" className="link-arrow">
            The PLANET 보기
          </a>
        </div>
      </div>
    </section>
  );
}
