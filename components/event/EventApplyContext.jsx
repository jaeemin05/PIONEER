'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const EventApplyContext = createContext(null);

export function EventApplyProvider({ children }) {
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

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);
  return <EventApplyContext.Provider value={value}>{children}</EventApplyContext.Provider>;
}

export function useEventApply() {
  const ctx = useContext(EventApplyContext);
  if (!ctx) throw new Error('useEventApply must be used inside EventApplyProvider');
  return ctx;
}
