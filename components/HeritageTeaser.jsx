"use client";

import { useFadeIn } from "@/hooks/useFadeIn";

export default function HeritageTeaser() {
  const fadeRef = useFadeIn();

  return (
    <section id="heritage-teaser" className="section">
      <div className="section-inner">
        <div className="section-label">Heritage</div>

        <div className="heritage-split fade-in" ref={fadeRef}>
          <div className="heritage-item">
            <span className="heritage-tag">PIONEER</span>
            <h3 className="heritage-title">
              정해진 디자인을 고르는 대신,
              <br />
              내가 좋아하는 것에서 시작합니다.
            </h3>
            <p className="heritage-body">
              우리는 매일 무엇을 입고, 어디서 시간을 보낼지, 어떤 물건을 살지
              고릅니다.
              <br />
              그런데 정작 ‘나는 무엇을 좋아하지?’라는 질문에는 쉽게 답하지 못할
              때가 있습니다.
              <br />
              <br />
              좋아하는 것은 분명하지만, 그것을 하나의 취향으로 들여다볼 기회는
              많지 않기 때문입니다.
              <br />
              <br />
              PIONEER는 여러 질문을 통해 취향과 기억을 모으고, 그 답들을 하나의
              디자인으로 연결합니다. 그렇게 세상에 하나뿐인 나만의 케이스가
              완성됩니다.
            </p>
          </div>
          <a href="pioneer-heritage.html" className="heritage-img-box">
            <img
              src="/heritage/spacecraft.jpg"
              alt="Pioneer 10 spacecraft"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                opacity: 0.8,
              }}
            />
            <div className="heritage-img-click">
              <span className="heritage-click-arrow">CLICK →</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
