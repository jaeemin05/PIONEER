'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ImageSlot from './ImageSlot';

const SCENES = [
  {
    num: 'S · 01',
    img: '/narrative/S01.jpg',
    imgLabel: 'S·01 — 항해 중',
    imgSub: '우주선 내부 계기판 또는 우주를 가르는 이미지',
    title: '항해 중',
    copy: '우주선을 타고 달려가고 있습니다. 목표가 있습니다. 성공, 인정, 더 나은 것들. 멈출 이유가 없습니다.',
    en: '"We all have somewhere to be."',
  },
  {
    num: 'S · 02',
    img: '/narrative/S02.jpg',
    imgLabel: 'S·02 — 의문',
    imgSub: '창밖을 바라보는 우주인, 정지된 순간',
    title: '의문',
    copy: '창밖을 바라봅니다. 이게 내가 원하던 방향이 맞나? 처음 드는 생각은 아닌데, 오늘은 좀 더 오래 머뭅니다.',
    en: '"You\'ve been moving. But have you been going anywhere?"',
  },
  {
    num: 'S · 03 — 04',
    img: '/narrative/S03.jpg',
    imgLabel: 'S·03 — 신호',
    imgSub: '계기판의 작은 신호 하나, 또는 어둠 속 희미한 빛점',
    title: '신호, 그리고 선택',
    copy: '계기판에 신호 하나가 잡힙니다. PIONEER Station. 크게 깜빡이지 않습니다. 그냥 거기 있습니다. 처음으로 속도를 줄입니다.',
    en: '"A signal. Small. Steady."',
  },
  {
    num: 'S · 05 — 06',
    img: '/narrative/S04.jpg',
    imgLabel: 'S·05·06 — 도착 + Navigator',
    imgSub: '정거장 내부, 테이블, 마주앉은 두 사람의 실루엣',
    title: '도착',
    copy: '정거장에 내립니다. 넓지 않습니다. 오랜만에 조용합니다. 누군가 있습니다. 그냥 얘기합니다.',
    en: '"Someone is here. No agenda."',
  },
  {
    num: 'S · 08 — 09',
    img: '/narrative/S05.jpg',
    imgLabel: 'S·08·09 — 재발견 + 수령',
    imgSub: 'The Plaque를 건네받는 순간, 또는 헬멧 바이저에 반사된 별',
    title: '재발견',
    copy: '내가 가고 싶었던 별이 보입니다. 없었던 것이 아닙니다. 몰랐던 것입니다. Navigator가 건넵니다. 손 안에 들어옵니다.',
    en: '"It was always there. You just hadn\'t looked."',
  },
  {
    num: 'S · 11',
    img: '/narrative/S06.jpg',
    imgLabel: 'S·11 — 새 항로',
    imgSub: '방향을 트는 우주선, 저 멀리 단 하나의 별',
    title: '새 항로',
    copy: '방향을 틉니다. 모두가 가던 쪽이 아닙니다. 저 멀리, 별 하나. The Plaque의 좌표와 같은 별입니다.',
    en: '"Not their star. Yours."',
  },
];

const TOTAL = SCENES.length;
const SWIPE_THRESHOLD = 48;

export default function Narrative() {
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const touchStartX = useRef(0);
  const mouseStartX = useRef(0);
  const isMouseDragging = useRef(false);

  const slideTo = useCallback((idx) => {
    setCurrent(((idx % TOTAL) + TOTAL) % TOTAL);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) > SWIPE_THRESHOLD) slideTo(current + (dx < 0 ? 1 : -1));
    };

    const onMouseDown = (e) => {
      mouseStartX.current = e.clientX;
      isMouseDragging.current = true;
      setDragging(true);
    };
    const onMouseUp = (e) => {
      if (!isMouseDragging.current) return;
      isMouseDragging.current = false;
      setDragging(false);
      const dx = e.clientX - mouseStartX.current;
      if (Math.abs(dx) > SWIPE_THRESHOLD) slideTo(current + (dx < 0 ? 1 : -1));
    };

    const onKeyDown = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect || rect.top > window.innerHeight || rect.bottom < 0) return;
      if (e.key === 'ArrowRight') slideTo(current + 1);
      if (e.key === 'ArrowLeft') slideTo(current - 1);
    };

    wrap.addEventListener('touchstart', onTouchStart, { passive: true });
    wrap.addEventListener('touchend', onTouchEnd, { passive: true });
    wrap.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      wrap.removeEventListener('touchstart', onTouchStart);
      wrap.removeEventListener('touchend', onTouchEnd);
      wrap.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [current, slideTo]);

  return (
    <section id="narrative" ref={sectionRef}>
      <div className="narrative-header">
        <div className="section-label" style={{ marginBottom: 0 }}>The Story</div>
        <div className="slider-controls">
          <span className="slider-counter">
            {String(current + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
          </span>
          <div className="slider-dots">
            {SCENES.map((_, i) => (
              <button
                key={i}
                className={`slider-dot${i === current ? ' active' : ''}`}
                aria-label={`Scene ${i + 1}`}
                onClick={() => slideTo(i)}
              />
            ))}
          </div>
          <button className="slider-btn" aria-label="이전" onClick={() => slideTo(current - 1)}>←</button>
          <button className="slider-btn" aria-label="다음" onClick={() => slideTo(current + 1)}>→</button>
        </div>
      </div>

      <div className={`slider-track-wrap${dragging ? ' dragging' : ''}`} ref={wrapRef}>
        <div className="slider-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {SCENES.map((scene, i) => (
            <div className="narrative-scene" key={i}>
              <ImageSlot
                className="scene-img"
                src={scene.img}
                alt={scene.imgLabel}
                label={scene.imgLabel}
                subLines={[scene.imgSub]}
              />
              <div className="scene-text">
                <span className="scene-num">{scene.num}</span>
                <div className="scene-title">{scene.title}</div>
                <p className="scene-copy">{scene.copy}</p>
                <span className="scene-en">{scene.en}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
