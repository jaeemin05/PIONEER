'use client';

import { useEffect, useRef, useState } from 'react';
import { useSessionModal } from './SessionModalContext';

export default function SessionModal() {
  const { isOpen, close } = useSessionModal();
  const [submitted, setSubmitted] = useState(false);

  const overlayRef = useRef(null);
  const formRef = useRef(null);
  const nameRef = useRef(null);
  const contactRef = useRef(null);
  const methodRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      nameRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) close();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = nameRef.current.value.trim();
    const contact = contactRef.current.value.trim();
    const method = methodRef.current.value;

    if (!name || !contact || !method) {
      [[nameRef, name], [contactRef, contact], [methodRef, method]].forEach(([ref, val]) => {
        if (!val) {
          ref.current.style.borderColor = 'var(--warn)';
          ref.current.addEventListener('input', () => { ref.current.style.borderColor = ''; }, { once: true });
        }
      });
      return;
    }

    setSubmitted(true);
    formRef.current.reset();
  };

  return (
    <div
      className={`modal-overlay${isOpen ? ' open' : ''}`}
      id="session-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className="modal">
        <button className="modal-close" onClick={close}>닫기 ✕</button>

        {!submitted && (
          <div id="modal-form-wrap">
            <div className="modal-eyebrow">Origin — Custom Plaque</div>
            <div className="modal-title" id="modal-title">나만의 Plaque를<br />만들어 드립니다.</div>
            <p className="modal-sub">
              Navigator와의 짧은 대화가 시작입니다.<br />연락처만 남겨주시면 Navigator가 먼저 연락드립니다.
            </p>

            <form className="modal-form" ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="f-name">이름</label>
                <input className="form-input" id="f-name" type="text" placeholder="홍길동" autoComplete="name" ref={nameRef} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="f-contact">연락처 (전화 또는 인스타그램 아이디)</label>
                <input className="form-input" id="f-contact" type="text" placeholder="010-0000-0000 또는 @username" ref={contactRef} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="f-method">대화 방식</label>
                <select className="form-select" id="f-method" ref={methodRef} defaultValue="" required>
                  <option value="" disabled>선택해주세요</option>
                  <option value="in-person">대면 (서울)</option>
                  <option value="online">온라인 (영상통화)</option>
                  <option value="either">둘 다 괜찮아요</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="f-memo">지금 어디쯤 있는지 — 한 줄이면 충분합니다 (선택)</label>
                <textarea className="form-textarea" id="f-memo" placeholder="요즘 좀 방향을 잃은 느낌이에요. / 잘 모르겠어요." />
              </div>
              <p className="modal-note">
                입력하신 정보는 세션 안내 목적으로만 사용되며, 외부에 공유되지 않습니다. Navigator가 2영업일
                내로 연락드립니다.
              </p>
              <button className="modal-submit" type="submit">신청하기 →</button>
            </form>
          </div>
        )}

        <div className={`modal-success${submitted ? ' show' : ''}`}>
          <div className="success-icon">✦</div>
          <div className="success-title">신청이 접수되었습니다.</div>
          <p className="success-body">Navigator가 2영업일 내로 연락드릴게요.<br />그때까지 조금만 기다려 주세요.</p>
        </div>
      </div>
    </div>
  );
}
