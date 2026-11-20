'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const EventApplyContext = createContext(null);

// 이벤트 페이지마다 다른 문구 — /event 기본값, 다른 페이지는 Provider에 copy로 넘김
const DEFAULT_COPY = { headline: '오픈 기념 이벤트', title: 'OPEN EVENT', name: '오픈 기념', eligibility: '서울·경기 거주 20대 한정!', limit: 30, source: 'event-page', maxBirthYear: 2009 };

export function EventApplyProvider({ children, copy = DEFAULT_COPY }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const value = useMemo(() => ({ isOpen, open, close, copy }), [isOpen, open, close, copy]);
  return <EventApplyContext.Provider value={value}>{children}</EventApplyContext.Provider>;
}

export function useEventApply() {
  const ctx = useContext(EventApplyContext);
  if (!ctx) throw new Error('useEventApply must be used inside EventApplyProvider');
  return ctx;
}
