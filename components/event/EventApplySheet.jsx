'use client';

import EventApplyForm from './EventApplyForm';
import { useEventApply } from './EventApplyContext';

export default function EventApplySheet() {
  const { isOpen, close } = useEventApply();
  if (!isOpen) return null;

  return (
    <div
      className="event-sheet-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="event-sheet" role="dialog" aria-modal="true" aria-label="이벤트 신청">
        <button type="button" className="event-sheet-close" onClick={close} aria-label="닫기">
          ✕
        </button>
        <EventApplyForm />
      </div>
    </div>
  );
}
