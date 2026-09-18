"use client";

import { useEffect, useRef, useState } from "react";
import { useFadeIn } from "@/hooks/useFadeIn";
import ImageSlot from "./ImageSlot";

const GAP = 10;
const DRAG_COMMIT_THRESHOLD = 44;
const DIRECTION_LOCK_THRESHOLD = 6;

function ShopItem({ item, className, style }) {
  const fadeRef = useFadeIn();
  return (
    <div className={className} style={style} ref={fadeRef}>
      <ImageSlot
        className="shop-img"
        phVariant="ph-light"
        src={item.img}
        alt={item.label}
        label={item.label}
        subLines={[item.sub]}
      />
      <span className="shop-coord">{item.coord}</span>
    </div>
  );
}

function ShopItemStatic({ item }) {
  return (
    <div className="shop-item" aria-hidden="true">
      <ImageSlot
        className="shop-img"
        phVariant="ph-light"
        src={item.img}
        alt={item.label}
        label={item.label}
        subLines={[item.sub]}
      />
      <span className="shop-coord">{item.coord}</span>
    </div>
  );
}

function MobileShopSwiper({ items }) {
  const n = items.length;
  const gridRef = useRef(null);
  const trackRef = useRef(null);
  const [cur, setCur] = useState(n);
  const [animate, setAnimate] = useState(false);
  const drag = useRef({ sx: 0, sy: 0, dx: 0, isH: null });

  const itemWidth = () =>
    (trackRef.current?.children[0]?.offsetWidth || 0) + GAP;
  const tx = (idx) => -(idx * itemWidth()) + 24;

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const onTouchStart = (e) => {
      drag.current = {
        sx: e.touches[0].clientX,
        sy: e.touches[0].clientY,
        dx: 0,
        isH: null,
      };
      setAnimate(false);
    };
    const onTouchMove = (e) => {
      const dx = e.touches[0].clientX - drag.current.sx;
      const dy = e.touches[0].clientY - drag.current.sy;
      if (
        drag.current.isH === null &&
        (Math.abs(dx) > DIRECTION_LOCK_THRESHOLD ||
          Math.abs(dy) > DIRECTION_LOCK_THRESHOLD)
      ) {
        drag.current.isH = Math.abs(dx) > Math.abs(dy);
      }
      if (drag.current.isH) {
        e.preventDefault();
        drag.current.dx = dx;
        if (trackRef.current)
          trackRef.current.style.transform = `translateX(${tx(cur) + dx}px)`;
      }
    };
    const onTouchEnd = () => {
      if (!drag.current.isH) return;
      let next = cur;
      if (Math.abs(drag.current.dx) > DRAG_COMMIT_THRESHOLD)
        next += drag.current.dx < 0 ? 1 : -1;
      setAnimate(true);
      setCur(next);
    };

    grid.addEventListener("touchstart", onTouchStart, { passive: true });
    grid.addEventListener("touchmove", onTouchMove, { passive: false });
    grid.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      grid.removeEventListener("touchstart", onTouchStart);
      grid.removeEventListener("touchmove", onTouchMove);
      grid.removeEventListener("touchend", onTouchEnd);
    };
  }, [cur]);

  const handleTransitionEnd = () => {
    if (cur < n) setCur((c) => c + n);
    else if (cur >= n * 2) setCur((c) => c - n);
    setAnimate(false);
  };

  const tripled = [...items, ...items, ...items];

  return (
    <div className="shop-grid" ref={gridRef}>
      <div
        className="shop-swipe-track"
        ref={trackRef}
        style={{
          transform: `translateX(${tx(cur)}px)`,
          transition: animate
            ? "transform 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
            : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {tripled.map((item, i) => (
          <ShopItemStatic key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

const DESKTOP_ITEM_BASIS = "29%";
const DESKTOP_GAP = 100;
const AUTO_SLIDE_SPEED = 40; // px / sec, 계속 흐르는 속도

function DesktopShopSlider({ items }) {
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });
  const paused = useRef(false);
  const singleSetWidth = useRef(0);
  const rafId = useRef(null);
  const lastTs = useRef(null);

  // 끊김없이 루프시키려면 아이템을 두 벌 이어붙이고, 한 벌 너비만큼 지나가면 그만큼 되감음(시각적으로는 무한 반복처럼 보임)
  const doubled = [...items, ...items];

  const measure = () => {
    if (trackRef.current)
      singleSetWidth.current = trackRef.current.scrollWidth / 2;
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  useEffect(() => {
    const tick = (ts) => {
      const el = scrollRef.current;
      if (el) {
        if (lastTs.current == null) lastTs.current = ts;
        const dt = (ts - lastTs.current) / 1000;
        lastTs.current = ts;
        if (!paused.current && !drag.current.active) {
          el.scrollLeft += AUTO_SLIDE_SPEED * dt;
        }
        const single = singleSetWidth.current;
        if (single > 0) {
          if (el.scrollLeft >= single) el.scrollLeft -= single;
          else if (el.scrollLeft < 0) el.scrollLeft += single;
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const step = () =>
    (trackRef.current?.children[0]?.offsetWidth || 300) + DESKTOP_GAP;
  const prev = () => {
    scrollRef.current.scrollLeft -= step();
  };
  const next = () => {
    scrollRef.current.scrollLeft += step();
  };

  const onPointerDown = (e) => {
    paused.current = true;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: scrollRef.current.scrollLeft,
      moved: false,
    };
    scrollRef.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    scrollRef.current.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = () => {
    drag.current.active = false;
  };
  // 드래그로 슬라이드를 옮긴 직후에는 클릭이 안 걸리게 (드래그 종료 시점의 click 이벤트 억제)
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div>
      <div
        ref={scrollRef}
        className="shop-slider-scroll"
        style={{ overflowX: "auto", cursor: "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onMouseEnter={() => {
          paused.current = true;
        }}
        onMouseLeave={() => {
          paused.current = false;
        }}
      >
        <div
          ref={trackRef}
          style={{ display: "flex", gap: `${DESKTOP_GAP}px` }}
        >
          {doubled.map((item, i) => (
            <ShopItem
              key={i}
              item={item}
              className="shop-item fade-in"
              style={{ flex: `0 0 ${DESKTOP_ITEM_BASIS}` }}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          marginTop: "16px",
        }}
      >
        <button className="slider-btn" aria-label="이전" onClick={prev}>
          ←
        </button>
        <button className="slider-btn" aria-label="다음" onClick={next}>
          →
        </button>
      </div>
    </div>
  );
}

export default function ShopCarousel({ items }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 900);
  }, []);

  if (isMobile) return <MobileShopSwiper items={items} />;

  return <DesktopShopSlider items={items} />;
}
