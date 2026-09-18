'use client';

import { useFadeIn } from '@/hooks/useFadeIn';

export default function HeritageTeaser() {
  const fadeRef = useFadeIn();

  return (
    <section id="heritage-teaser" className="section">
      <div className="section-inner">
        <div className="section-label">Heritage</div>

        <div className="heritage-split fade-in" ref={fadeRef}>
          <div className="heritage-item">
            <span className="heritage-tag">PIONEER</span>
            <h3 className="heritage-title">1972년, 인류 최초로<br />태양계를 떠난 탐사선</h3>
            <p className="heritage-body">
              파이어니어 10호는 목성을 지나 태양계 바깥으로 향한 첫 번째 인공물입니다. 지금 이 순간에도
              달리고 있습니다. 멈추지 않고, 방향도 바꾸지 않고.
            </p>
          </div>
          <a href="pioneer-heritage.html" className="heritage-img-box">
            <img
              src="/heritage/spacecraft.jpg"
              alt="Pioneer 10 spacecraft"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.8 }}
            />
            <div className="heritage-img-click">
              <span className="heritage-click-arrow">CLICK →</span>
            </div>
          </a>
          <div className="heritage-item">
            <span className="heritage-tag">The Plaque</span>
            <h3 className="heritage-title">금속판 하나,<br />우주로 보낸 기록</h3>
            <p className="heritage-body">
              탐사선에는 금속판이 실렸습니다. 인류가 누구인지, 어디서 왔는지를 새긴 것입니다. 언젠가
              발견될 누군가를 위한 좌표. 우리는 그것을 The Plaque라고 부릅니다.
            </p>
          </div>
          <a href="pioneer-heritage.html" className="heritage-img-box">
            <img
              src="/heritage/plaque.jpg"
              alt="The Pioneer Plaque"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.85 }}
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
