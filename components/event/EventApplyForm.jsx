"use client";

import { useEffect, useState } from "react";
import EventSelect from "./EventSelect";

const REF_KEY = "pioneer-ref";
// 1997년생 ~ 2008년생
const BIRTH_YEARS = Array.from({ length: 2008 - 1997 + 1 }, (_, i) => 1997 + i);
function formatPhone(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.startsWith("02")) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9)
      return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 10)
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

const BIRTH_YEAR_OPTIONS = BIRTH_YEARS.map((y) => ({
  value: String(y),
  label: `${String(y).slice(2)}년생${y === 1997 ? " 이상" : y === 2008 ? " 이하" : ""}`,
}));
const REF_PATTERN = /^[A-Za-z0-9_-]{1,32}$/;

const PLANET_TYPES = {
  1: {
    name: "항로자",
    desc: "정해진 길보다 자신만의 항로를 개척하는 행성. 멈추지 않고 나아갑니다.",
    words: ["도전적인", "추진력 있는", "용감한"],
  },
  2: {
    name: "고요한 궤도",
    desc: "소음 없는 자리에서 스스로의 속도를 지키는 행성.",
    words: ["차분한", "평온한", "혼자가 편한"],
  },
  3: {
    name: "신호지기",
    desc: "누군가에게 먼저 손을 내미는 다정한 신호를 보내는 행성.",
    words: ["다정한", "공감을 잘하는", "따뜻한"],
  },
  4: {
    name: "좌표 설계자",
    desc: "모든 좌표를 하나하나 정확히 새기는 신중한 행성.",
    words: ["꼼꼼한", "신중한", "완벽주의"],
  },
  5: {
    name: "심우주",
    desc: "겉으로 드러나지 않는 깊은 사유를 품은 행성.",
    words: ["사색적인", "신비로운", "통찰력 있는"],
  },
  6: {
    name: "이온 궤적",
    desc: "지나간 자리마다 뜨거운 궤적을 남기는 행성.",
    words: ["열정적인", "활기찬", "자신감 있는"],
  },
  7: {
    name: "성도",
    desc: "복잡한 것을 하나의 질서로 정리해내는 행성.",
    words: ["논리적인", "분석적인", "체계적인"],
  },
  8: {
    name: "열린 프런티어",
    desc: "경계 없이 새로운 궤도로 뛰어드는 자유로운 행성.",
    words: ["자유로운", "호기심 많은", "유연한"],
  },
  9: {
    name: "변함없는 항로",
    desc: "한 번 정한 방향은 끝까지 지키는 성실한 행성.",
    words: ["성실한", "의리있는", "조화로운"],
  },
};

const ALL_WORDS = Object.values(PLANET_TYPES).flatMap((t) => t.words);

function matchPlanets(active) {
  const scores = Object.entries(PLANET_TYPES).map(([type, info]) => {
    const hit = info.words.filter((w) => active.includes(w));
    return { type, ...info, score: hit.length, hit };
  });
  const maxScore = Math.max(...scores.map((s) => s.score));
  if (maxScore === 0) return [];
  return scores.filter((s) => s.score === maxScore);
}

// 구글 시트로 연결되는 Apps Script 웹앱 URL. .env.local에 NEXT_PUBLIC_EVENT_SCRIPT_URL로
// 설정 — 값이 없으면 콘솔에만 남기고 UI는 정상적으로 성공 화면을 보여줌(로컬/프리뷰 대비).
const SCRIPT_URL = process.env.NEXT_PUBLIC_EVENT_SCRIPT_URL;

export default function EventApplyForm() {
  const [selected, setSelected] = useState(new Set());
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [region, setRegion] = useState("");
  const [contact, setContact] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [referrer, setReferrer] = useState("direct");

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("ref");
    let saved = null;
    try {
      if (fromUrl && REF_PATTERN.test(fromUrl))
        sessionStorage.setItem(REF_KEY, fromUrl);
      saved = sessionStorage.getItem(REF_KEY);
    } catch {
      saved = fromUrl;
    }
    setReferrer(saved && REF_PATTERN.test(saved) ? saved : "direct");
  }, []);

  const active = [...selected];
  const matches = active.length >= 3 ? matchPlanets(active) : [];

  const toggleWord = (word) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (active.length < 3)
      nextErrors.words = "나의 행성 찾기: 단어를 3개 이상 골라주세요.";
    if (!name.trim()) nextErrors.name = true;
    if (!birthYear) nextErrors.birthYear = true;
    if (!region.trim()) nextErrors.region = true;
    if (!contact.trim()) nextErrors.contact = true;
    if (!agree) nextErrors.agree = true;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);

    const data = {
      source: "event-page",
      words: active.join(", "),
      matchedPlanets: matches.map((m) => m.name).join(", "),
      name: name.trim(),
      birthYear,
      region: region.trim(),
      contact: contact.trim(),
      referrer,
    };

    const finish = () => {
      setSubmitting(false);
      setSubmitted(true);
    };

    if (!SCRIPT_URL) {
      console.warn(
        "NEXT_PUBLIC_EVENT_SCRIPT_URL이 설정되지 않아 실제로 전송되지는 않았습니다.",
        data,
      );
      finish();
      return;
    }

    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
    })
      .then(finish)
      .catch(finish);
  };

  if (submitted) {
    return (
      <section className="event-apply-body">
        <div className="section-inner event-apply-inner">
          <div className="modal-success show">
            <div className="success-icon">✦</div>
            <div className="success-title">신청이 접수되었습니다.</div>
            <p className="success-body">
              Navigator가 금일 & 익일 내로 연락드릴게요.
              <br />
              그때까지 조금만 기다려 주세요.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="event-apply-body">
      <div className="section-inner event-apply-inner">
        <div className="modal-eyebrow">Apply</div>
        <h2 className="modal-title">오픈 기념 이벤트 신청하기</h2>
        <p className="modal-sub">
          아래 정보를 남겨주시면 확인 후 기재해주신 연락처로 연락드려요.
        </p>
        <p className="event-promo-line">
          PIONEER 오픈 기념 이벤트 · 무료로 만나보세요
        </p>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">나의 행성 찾기 *</label>
            <p className="event-mini-note">
              마음에 드는 단어를 3개 이상 골라주면 어울리는 행성 유형을
              찾아드려요.
            </p>
            <div className="event-chip-counter">
              {active.length}개 선택됨
              {active.length >= 3 ? " ✓" : " (3개 이상 골라줘)"}
            </div>
            <div className="event-chip-wrap">
              {ALL_WORDS.map((word) => (
                <button
                  type="button"
                  key={word}
                  className={`event-chip${selected.has(word) ? " active" : ""}`}
                  onClick={() => toggleWord(word)}
                >
                  {word}
                </button>
              ))}
            </div>
            {matches.length > 0 && (
              <div className="event-match-preview">
                {matches.map((m) => (
                  <div key={m.type}>
                    ✦ <b>{m.name}</b>
                    <br />
                    {m.desc}
                    <br />
                    <span className="event-match-hit">
                      일치한 단어: {m.hit.join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {errors.words && <p className="event-error">{errors.words}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="event-name">
              이름
            </label>
            <input
              className="form-input"
              id="event-name"
              type="text"
              placeholder="홍길동"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((p) => ({ ...p, name: false }));
              }}
              style={errors.name ? { borderColor: "var(--warn)" } : undefined}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="event-birth-year">
              몇년생
            </label>
            <EventSelect
              id="event-birth-year"
              options={BIRTH_YEAR_OPTIONS}
              value={birthYear}
              placeholder="선택해주세요"
              invalid={!!errors.birthYear}
              onChange={(v) => {
                setBirthYear(v);
                setErrors((p) => ({ ...p, birthYear: false }));
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="event-region">
              거주지 (배송 가능 인근역)
            </label>
            <input
              className="form-input"
              id="event-region"
              type="text"
              placeholder="예: 서울 강남구 (강남역)"
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setErrors((p) => ({ ...p, region: false }));
              }}
              style={errors.region ? { borderColor: "var(--warn)" } : undefined}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="event-contact">
              연락처
            </label>
            <input
              className="form-input"
              id="event-contact"
              type="tel"
              placeholder="010-0000-0000"
              value={contact}
              onChange={(e) => {
                setContact(formatPhone(e.target.value));
                setErrors((p) => ({ ...p, contact: false }));
              }}
              style={
                errors.contact ? { borderColor: "var(--warn)" } : undefined
              }
            />
          </div>

          <label className="event-agree">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => {
                setAgree(e.target.checked);
                setErrors((p) => ({ ...p, agree: false }));
              }}
            />
            <span>
              개인정보 수집·이용에 동의해요 <br />
              <em className="event-agree-note">
                (*이벤트 안내 용도 외에는 사용하지 않습니다.)
              </em>
              {errors.agree && (
                <span style={{ color: "var(--warn)" }}> (필수)</span>
              )}
            </span>
          </label>
          <div className="event-consent">
            <h4 className="event-consent-title">
              개인정보 수집 및 이용 동의서
            </h4>
            <dl className="event-consent-list">
              <dt>수집·이용 목적</dt>
              <dd>이벤트 진행 및 경품 배송</dd>
              <dt>수집 항목</dt>
              <dd>이름, 출생연도, 거주지, 연락처, 선택 키워드</dd>
              <dt>보유·이용 기간</dt>
              <dd>이벤트 종료 후 30일</dd>
            </dl>

            <h4 className="event-consent-title">개인정보 제3자 제공 동의</h4>
            <dl className="event-consent-list">
              <dt>제공받는 자</dt>
              <dd>파이어니어</dd>
              <dt>이용 목적</dt>
              <dd>이벤트 진행 및 경품 배송</dd>
              <dt>제공 항목</dt>
              <dd>이름, 출생연도, 거주지, 연락처, 선택 키워드</dd>
              <dt>보유·이용 기간</dt>
              <dd>이벤트 종료 후 즉시 파기</dd>
            </dl>
          </div>

          <button className="modal-submit" type="submit" disabled={submitting}>
            {submitting ? "보내는 중..." : "신청하기 →"}
          </button>
        </form>
      </div>
    </section>
  );
}
