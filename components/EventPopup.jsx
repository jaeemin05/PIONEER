'use client';

import { useEffect, useState } from 'react';

const DISMISS_KEY = 'pioneer-event-popup-dismissed';
const SHOW_DELAY = 1000;

export default function EventPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    let dismissedDate = null;
    try {
      dismissedDate = localStorage.getItem(DISMISS_KEY);
    } catch {
      // localStorage 접근 불가 시(프라이빗 모드 등) 그냥 매번 보여줌
    }
    if (dismissedDate === today) return;

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const close = () => setVisible(false);

  const dismissToday = () => {
    try {
      localStorage.setItem(DISMISS_KEY, new Date().toDateString());
    } catch {
      // 저장 실패해도 이번 방문에서 닫히는 것까지는 동작
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="event-popup-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="event-popup-card">
        <button className="event-popup-close" onClick={close} aria-label="닫기">✕</button>
        <span className="event-popup-tag">EVENT</span>
        <h3 className="event-popup-title">OPEN EVENT</h3>
        <p className="event-popup-eligibility">서울·경기 거주 20대 한정!</p>
        <p className="event-popup-desc">
          나의 우주를 담은 폰케이스를 디자인해드려요!
          <br />
          선착순 30명 · 커스텀 <span style={{ color: 'var(--green)' }}>폰케이스</span> 제작 무료 이벤트
        </p>
        <a className="event-popup-cta" href="/event">지금 신청하기 →</a>
        <button className="event-popup-dismiss" onClick={dismissToday}>오늘 하루 보지 않기</button>
      </div>
    </div>
  );
}
