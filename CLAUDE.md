# CLAUDE.md

## 프로젝트
**PIONEER** — "Go. Lightly." 슬로건의 커스텀 폰케이스("The Plaque") 브랜드 랜딩 페이지.
1972년 파이오니어 10호 탐사선과 그 금속판(Pioneer Plaque)에서 모티프를 가져온 컨셉으로, 고객의 세계관을 담은 케이스를 판매한다.
라이브: https://pioneerstation.vercel.app/

## 스택
- **Next.js 16 (App Router) + React 19 + 순수 JS(.jsx, TypeScript 아님).** 원래 순수 정적 HTML 한 파일이었는데, 3D 요소 도입을 계기로 Next.js + react-three-fiber로 전체 이전함 (마이그레이션 계획: `~/.claude/plans/floofy-gliding-pine.md`).
- `index.html`은 **삭제하지 않고 참조용으로 유지 중** — 실제 서비스되는 페이지가 아니라 마이그레이션 시각 diff 기준점.
- 3D: `three` + `@react-three/fiber` + `@react-three/drei`. 현재 유일한 3D 요소는 히어로 배경의 별 파티클 필드(`components/Hero3D.jsx`, drei `<Stars>`) — 3D는 이 한 곳에만 집중, 다른 섹션엔 안 씀.
- **의존성 버전 주의**: `react`/`react-dom`은 `19.2.8`로 **정확히 고정**(caret 없음). `@react-three/fiber@9.x`가 `react: ">=19 <19.3"`를 요구해서, npm 최신 안정판인 19.3.0과 충돌함. `npm install` 시 이 핀을 건드리지 말 것.
- 스타일링: Tailwind나 CSS-in-JS 없이 기존 커스텀 프로퍼티 기반 CSS를 `app/globals.css`에 거의 그대로 이식. 폰트도 `next/font` 대신 기존 Google Fonts `<link>` 태그 유지.
- Next 16은 `next lint` 명령이 제거됨 — lint 설정/스크립트 없음 (요청받지 않았고, ESLint Flat Config로 새로 세팅하는 건 스코프 밖).
- 로컬: `npm run dev` (Turbopack). 배포 전 `npm run build && npm run start`로 프로덕션 빌드 확인 권장. 별도 테스트 스위트 없음.
- **Vercel 배포 시 주의**: 기존엔 "Other"(정적 사이트) 프리셋이었는데, 이제 Vercel 대시보드에서 Framework Preset을 "Next.js"로 바꿔야 함 — 코드가 아니라 프로젝트 설정 변경이라 자동으로 안 됨.

## 구조 (app/page.js가 조립하는 순서, 컴포넌트는 components/)
1. `Header` — 로고 + 내비 + 스크롤 시 solid 배경 전환 (`site-header.scrolled`)
2. `Hero` + `Hero3D` — 로고/태그라인 + 별 파티클 배경(3D)
3. `Opening` — 카피 인트로
4. `PlaqueReveal` — 제품(The Plaque) 첫 소개
5. `HeritageTeaser` — 파이오니어 10호/금속판 헤리티지 티저 → `pioneer-heritage.html`로 링크(빌드 안 함, 링크만 유지)
6. `Narrative` — 6단계 스토리 슬라이더(dots/arrows/swipe/drag/keyboard, `useState` 기반)
7. `Shop` + `ShopCarousel` — 제품 라인업: **Signal**(기성) / **Origin**(커스텀, 세션 모달 유도). 모바일 폭에서는 무한루프 스와이퍼로 전환(로드 시 1회만 판정, 리사이즈 반응 없음 — 원본 그대로 유지한 의도된 갭)
8. `Experience` — Navigator 세션 진행 방식(Stop → Talk → Receive)
9. `Destination` — CTA 섹션
10. `SystemSection` — World · Moment · Coordinates
11. `Footer` + `SessionModal`/`SessionModalContext` — 세션 신청 모달, 4곳(Header/Shop/Destination/Footer)에서 Context로 트리거

## 알려진 갭 (의도적으로 유지 중, "고쳐야 할 버그"로 착각하지 말 것)
- `spacecraft.jpg`, `plaque.jpg` 및 Signal/Origin 제품 이미지 — 로컬에 파일 없음, 404 그대로. `.ph`/`.ph-dark` 플레이스홀더로 표시됨. (`hero-bg.jpg`는 Hero3D로 대체되어 더 이상 존재하지 않음 — 유일하게 "해결된" 이미지 갭.)
- `pioneer-heritage.html` — 존재하지 않는 페이지, 링크만 유지.
- Signal "전체 보기", footer "Instagram" — `href="#"` 죽은 링크.
- 세션 폼 제출 — 실제 백엔드 없음, 클라이언트에서 성공 화면만 토글.
- 모바일 샵 스와이퍼는 로드 시 `window.innerWidth`를 1회만 체크 — 리사이즈해도 모드 안 바뀜(원본 동작 그대로 유지).
- 라이브 배포본(https://pioneerstation.vercel.app/)에는 이 이미지들과 `pioneer-heritage.html`이 실제로 채워져 있을 가능성이 높음 — 로컬 작업이 배포본보다 오래된 콘텐츠 기준일 수 있으니 유의.

## 폼/CTA 동작
- 세션 모달은 `components/SessionModalContext.jsx`의 Context로 열고 닫음 (`useSessionModal()`). DOM 쿼리셀렉터 방식(`data-session-open`) 아님.
- 모달 제출은 현재 **UI 단계에서만 성공 처리**됨 — 실제 백엔드/이메일 전송 연동 없음.
- 폼 필수값 미입력 시 테두리를 `var(--warn)`(#FF6B4A)로 표시 — `--green`을 쓰지 않는 이유는 그린이 이미 "Signal/CTA"를 의미해서 에러 색으로 재사용하면 의미가 충돌하기 때문 (apple-design 스킬 리뷰에서 발견).

## 컨벤션
- 화면에 보이는 카피는 한국어, 클래스명/id/영어 라벨(SIGNAL, ORIGIN 등)은 영어 유지.
- 색상/폰트는 `app/globals.css`의 `:root` CSS 변수로 통일 관리: `--navy`(배경), `--green`(Signal/포인트), `--pink`(Origin/CTA 강조), `--gray`, `--cream`, `--text-dim`(본문 보조 텍스트, WCAG AA 대비 확보용), `--warn`(폼 에러 전용).
- 신규 섹션 추가 시 기존 컴포넌트처럼 `.section-label`, `fade-in` 클래스(`hooks/useFadeIn.js` 재사용), placeholder(`.ph`/`.ph-dark`) 패턴을 그대로 따를 것.
- 컴포넌트는 섹션당 하나, 대부분 `'use client'` (스크롤/페이드인/인터랙션 때문). `app/page.js`만 순수 서버 컴포넌트.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
