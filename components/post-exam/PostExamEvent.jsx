"use client";

import { useEffect, useRef, useState } from "react";
import {
  RECRUITMENT_START,
  REGIONS,
  WORDS,
  validateApplication,
} from "@/lib/post-exam.mjs";
import styles from "./PostExamEvent.module.css";

const faqs = [
  [
    "누가 참여할 수 있나요?",
    "서울·경기남부 지역의 수험생을 위한 이벤트예요. 신청 내용을 확인한 뒤 개별 연락으로 참여 안내를 드립니다.",
  ],
  [
    "어떤 케이스를 만들어주나요?",
    "좋아하는 것과 나의 이야기를 나눈 뒤, 나만의 PLANET을 담은 커스텀 폰케이스를 제작해요. 페이지의 제품 이미지는 디자인 예시이며, 지원 기종은 개별 안내 시 확인해요.",
  ],
  [
    "언제부터 신청할 수 있나요?",
    "10월 29일부터 모집을 시작해요. 신청 후 기재한 휴대폰 번호로 다음 과정을 안내해드립니다.",
  ],
  [
    "디자인을 미리 준비해야 하나요?",
    "준비된 디자인이 없어도 괜찮아요. 좋아하는 색, 요즘 빠져 있는 것, 간직하고 싶은 이야기부터 함께 찾아가요.",
  ],
];

export default function PostExamEvent() {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [values, setValues] = useState({
    name: "",
    contact: "",
    region: "",
    examinee: false,
    agree: false,
    words: [],
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const sendingRef = useRef(false);
  const referrerRef = useRef("direct");

  useEffect(() => {
    const update = () => setStarted(Date.now() >= RECRUITMENT_START);
    update();
    const timer = setInterval(update, 30000);
    try {
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref && /^[A-Za-z0-9_-]{1,32}$/.test(ref))
        sessionStorage.setItem("pioneer-ref", ref);
      referrerRef.current = sessionStorage.getItem("pioneer-ref") || "direct";
    } catch {
      /* 신청은 브라우저 저장소 없이도 가능 */
    }
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current.showModal();
    return () => {
      document.body.style.overflow = previous;
      triggerRef.current?.focus();
    };
  }, [open]);

  const launch = (event) => {
    triggerRef.current = event.currentTarget;
    setOpen(true);
  };
  const close = () => {
    if (!sendingRef.current) setOpen(false);
  };
  const update = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setMessage("");
  };
  const submit = async (event) => {
    event.preventDefault();
    if (sendingRef.current) return;
    const nextErrors = validateApplication(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() =>
        dialogRef.current?.querySelector('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    if (Date.now() < RECRUITMENT_START) {
      setMessage("10월 29일부터 신청할 수 있어요.");
      return;
    }
    sendingRef.current = true;
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/post-exam-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, referrer: referrerRef.current }),
        signal: AbortSignal.timeout(20000),
      });
      const data = await response.json();
      if (!response.ok || data.ok !== true) {
        setErrors(data.errors || {});
        throw new Error(
          data.error || "접수를 확인하지 못했어요. 잠시 후 다시 시도해주세요.",
        );
      }
      setStatus("success");
    } catch (error) {
      setStatus("idle");
      setMessage(
        error.name === "TimeoutError" || error.name === "TypeError"
          ? "연결을 확인해주세요. 입력 내용은 유지됩니다. 잠시 후 다시 시도해주세요."
          : error.message,
      );
    } finally {
      sendingRef.current = false;
    }
  };
  const errorProps = (key) => ({
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `v2-${key}-error` : undefined,
  });
  const errorText = (key) =>
    errors[key] && (
      <span className={styles.fieldError} id={`v2-${key}-error`}>
        {errors[key]}
      </span>
    );
  const cta = started ? "무료 제작 신청하기" : "신청 내용 미리 작성하기";

  return (
    <div className={styles.page}>
      <a href="#v2-main" className={styles.skip}>
        본문으로 바로가기
      </a>
      <header className={styles.header}>
        <a href="/" className={styles.logo} aria-label="PIONEER 홈">
          PIONEER<span>®</span>
        </a>
        <span className={styles.headerNote}>AFTER EXAM, YOUR ORBIT.</span>
        <a href="#v2-info" className={styles.headerLink}>
          참여 안내 ↗
        </a>
      </header>
      <main id="v2-main">
        <section className={styles.hero} aria-labelledby="v2-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span /> 수험생을 위한 OPEN EVENT
            </p>
            <h1 id="v2-title">
              수능 끝.
              <br />
              이젠 <em>내 취향</em>
              <br />
              차례.
            </h1>
            <p className={styles.intro}>
              정답을 찾던 시간 다음엔,
              <br />
              나를 찾아가는 시간.
            </p>
            <div className={styles.offer}>
              <span>나만의 커스텀 폰케이스</span>
              <strong>
                제작 무료 <span>↗</span>
              </strong>
            </div>
            <p className={styles.conditions}>
              <time dateTime="2026-10-29">10.29 모집 시작</time>
              <span>서울·경기남부 수험생</span>
            </p>
            <button className={styles.button} onClick={launch}>
              {cta}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
          <div className={styles.heroArt}>
            <span className={styles.orbit} aria-hidden="true" />
            <span className={styles.star} aria-hidden="true">
              ✦
            </span>
            <span className={styles.artLabel}>
              YOUR STORY,
              <br />
              YOUR PLANET.
            </span>
            <img
              className={styles.heroPhone}
              src="/shop/origin/org08.png"
              alt="보라와 푸른빛 행성 무늬를 담은 커스텀 폰케이스 디자인 예시"
              fetchPriority="high"
              width="1200"
              height="900"
            />
            <span className={styles.artNumber}>01 — ∞</span>
            <span className={styles.example}>디자인 예시</span>
          </div>
        </section>
        <div className={styles.ticker} aria-hidden="true">
          NO RIGHT ANSWER. JUST YOUR OWN. <span>✦</span> GO. LIGHTLY.{" "}
          <span>✦</span> YOUR NEXT CHAPTER.
        </div>
        <section className={styles.story} aria-labelledby="v2-story-title">
          <p className={styles.label}>01 / MADE OF YOU</p>
          <div className={styles.storyGrid}>
            <div>
              <h2 id="v2-story-title">
                좋아하는 것들을
                <br />
                <span>케이스에 담아볼까?</span>
              </h2>
              <p>
                계속 듣는 노래, 좋아하는 색,
                <br />
                앞으로 만나고 싶은 나까지.
                <br />
                작은 이야기들이 하나의 행성이 됩니다.
              </p>
            </div>
            <div className={styles.storyCard}>
              <span>
                NOT A SCORE.
                <br />A STORY.
              </span>
              <img
                src="/shop/origin/org03.png"
                alt="초록빛 궤도가 표현된 폰케이스 디자인 예시"
                width="1200"
                height="900"
                loading="lazy"
              />
              <small>당신의 취향은 어떤 행성인가요? · 디자인 예시</small>
            </div>
          </div>
        </section>
        <section className={styles.process} aria-labelledby="v2-process-title">
          <p className={styles.label}>02 / HOW IT WORKS</p>
          <h2 id="v2-process-title">
            내 이야기에서,
            <br />내 손안의 PLANET으로.
          </h2>
          <ol>
            {[
              [
                "신청을 남겨요",
                "간단한 정보와 연락처를 남겨주세요. 신청 확인 후 개별 안내를 드려요.",
              ],
              [
                "취향을 나눠요",
                "대화를 통해 좋아하는 것과 나의 이야기를 함께 찾아가요.",
              ],
              [
                "나만의 케이스로 만나요",
                "이야기를 담은 PLANET 디자인으로 커스텀 폰케이스를 제작해요.",
              ],
            ].map(([title, text], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>
        <section
          id="v2-info"
          className={styles.info}
          aria-labelledby="v2-info-title"
        >
          <div>
            <p className={styles.label}>03 / YOUR INVITATION</p>
            <h2 id="v2-info-title">
              수고한 나에게,
              <br />
              취향을 담은 선물.
            </h2>
            <p>새로운 시작을 PIONEER와 함께.</p>
          </div>
          <div className={styles.ticket}>
            <span className={styles.ticketTop}>
              PIONEER OPEN EVENT <span>✦</span>
            </span>
            <dl>
              <div>
                <dt>제공 혜택</dt>
                <dd>커스텀 폰케이스 제작 무료</dd>
              </div>
              <div>
                <dt>참여 대상</dt>
                <dd>수험생</dd>
              </div>
              <div>
                <dt>참여 지역</dt>
                <dd>서울·경기남부</dd>
              </div>
              <div>
                <dt>모집 시작</dt>
                <dd>10월 29일</dd>
              </div>
            </dl>
            <button onClick={launch} className={styles.button}>
              {cta}
              <span aria-hidden="true">↗</span>
            </button>
            <p>신청 후 개별 연락으로 참여 과정을 안내해요.</p>
          </div>
        </section>
        <section className={styles.faq} aria-labelledby="v2-faq-title">
          <p className={styles.label}>04 / GOOD TO KNOW</p>
          <h2 id="v2-faq-title">궁금한 이야기.</h2>
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
      </main>
      <footer className={styles.footer}>
        <a href="/">PIONEER®</a>
        <p>
          Go. Lightly.
          <br />
          이제, 나만의 궤도로.
        </p>
        <small>© 2026 PIONEER</small>
      </footer>
      <div className={styles.sticky}>
        <div>
          <strong>커스텀 폰케이스 제작 무료</strong>
          <span>10.29 모집 시작 · 서울·경기남부</span>
        </div>
        <button onClick={launch}>
          {started ? "신청하기" : "미리 작성"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      {open && (
        <dialog
          ref={dialogRef}
          className={styles.dialog}
          aria-labelledby="v2-form-title"
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className={styles.dialogBody}>
            <button
              className={styles.close}
              type="button"
              onClick={close}
              disabled={status === "sending"}
              aria-label="신청 창 닫기"
            >
              ×
            </button>
            {status === "success" ? (
              <div className={styles.success} role="status">
                <span>✦</span>
                <h2 id="v2-form-title">신청이 접수됐어요.</h2>
                <p>
                  남겨주신 연락처로 참여 과정을 안내드릴게요.
                  <br />
                  우리, 나만의 PLANET으로 만나요.
                </p>
                <button className={styles.button} onClick={close}>
                  확인
                </button>
              </div>
            ) : (
              <>
                <p className={styles.label}>YOUR NEXT CHAPTER</p>
                <h2 id="v2-form-title">내 취향을 만날 준비.</h2>
                <p className={styles.formIntro}>
                  수험생 무료 커스텀 폰케이스 제작
                  <br />
                  서울·경기남부 · 10월 29일 모집 시작
                </p>
                {!started && (
                  <p className={styles.notice}>
                    지금은 모집 전이에요. 내용을 미리 작성해볼 수 있으며, 접수는
                    10월 29일부터 가능해요.
                  </p>
                )}
                <form
                  onSubmit={submit}
                  noValidate
                  aria-busy={status === "sending"}
                >
                  <fieldset
                    disabled={status === "sending"}
                    className={styles.fields}
                  >
                    <label htmlFor="v2-name">
                      이름 <span>필수</span>
                    </label>
                    <input
                      id="v2-name"
                      autoComplete="name"
                      maxLength={40}
                      value={values.name}
                      onChange={(e) => update("name", e.target.value)}
                      {...errorProps("name")}
                    />
                    {errorText("name")}
                    <label htmlFor="v2-contact">
                      휴대폰 번호 <span>필수</span>
                    </label>
                    <input
                      id="v2-contact"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="010-0000-0000"
                      maxLength={14}
                      value={values.contact}
                      onChange={(e) => update("contact", e.target.value)}
                      {...errorProps("contact")}
                    />
                    {errorText("contact")}
                    <label htmlFor="v2-region">
                      참여 지역 <span>필수</span>
                    </label>
                    <select
                      id="v2-region"
                      value={values.region}
                      onChange={(e) => update("region", e.target.value)}
                      {...errorProps("region")}
                    >
                      <option value="">지역을 선택해주세요</option>
                      {REGIONS.map((region) => (
                        <option key={region}>{region}</option>
                      ))}
                    </select>
                    {errorText("region")}
                    <fieldset className={styles.wordGroup}>
                      <legend>
                        나를 닮은 단어 <small>선택</small>
                      </legend>
                      <div className={styles.words}>
                        {WORDS.map((word) => (
                          <button
                            key={word}
                            type="button"
                            aria-pressed={values.words.includes(word)}
                            onClick={() =>
                              update(
                                "words",
                                values.words.includes(word)
                                  ? values.words.filter((v) => v !== word)
                                  : [...values.words, word],
                              )
                            }
                          >
                            {word}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <label className={styles.check}>
                      <input
                        type="checkbox"
                        checked={values.examinee}
                        onChange={(e) => update("examinee", e.target.checked)}
                        {...errorProps("examinee")}
                      />
                      수험생 대상 이벤트임을 확인했어요. (필수)
                    </label>
                    {errorText("examinee")}
                    <details className={styles.consent}>
                      <summary>개인정보 수집·이용 안내</summary>
                      <p>
                        수집·이용 주체: PIONEER
                        <br />
                        목적: 이벤트 신청 확인 및 참여 안내
                        <br />
                        항목: 이름, 휴대폰 번호, 참여 지역, 선택한 취향 키워드
                        <br />
                        보유 기간: 이벤트 종료 후 30일
                        <br />
                        동의를 거부할 수 있으며, 거부 시 신청이 어려워요.
                      </p>
                    </details>
                    <label className={styles.check}>
                      <input
                        type="checkbox"
                        checked={values.agree}
                        onChange={(e) => update("agree", e.target.checked)}
                        {...errorProps("agree")}
                      />
                      개인정보 수집·이용에 동의해요. (필수)
                    </label>
                    {errorText("agree")}
                    {message && (
                      <p className={styles.fieldError} role="alert">
                        {message}
                      </p>
                    )}
                    <button
                      type="submit"
                      className={styles.button}
                      disabled={!started || status === "sending"}
                    >
                      {status === "sending"
                        ? "접수 확인 중…"
                        : started
                          ? "무료 제작 신청하기 ↗"
                          : "10월 29일에 신청할 수 있어요"}
                    </button>
                  </fieldset>
                </form>
              </>
            )}
          </div>
        </dialog>
      )}
    </div>
  );
}
