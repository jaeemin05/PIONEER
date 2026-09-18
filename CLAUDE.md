# CLAUDE.md

## 프로젝트
**PIONEER** — "Go. Lightly." 슬로건의 커스텀 폰케이스("The Plaque") 브랜드 랜딩 페이지.
1972년 파이오니어 10호 탐사선과 그 금속판(Pioneer Plaque)에서 모티프를 가져온 컨셉으로, 고객의 세계관을 담은 케이스를 판매한다.
라이브(Next.js 버전): https://pioneer-iota-five.vercel.app/ (Vercel 프로젝트: `odd3/pioneer`)
GitHub: https://github.com/jaeemin05/PIONEER
참고 — https://pioneerstation.vercel.app/ 는 마이그레이션 이전의 구버전 정적 사이트가 올라가 있던 별개의 Vercel 계정/프로젝트로, 이 리포에서는 접근 불가(이번 Next.js 버전과 무관).

## 스택
- **Next.js 16 (App Router) + React 19 + 순수 JS(.jsx, TypeScript 아님).** 원래 순수 정적 HTML 한 파일이었는데, 3D 요소 도입을 계기로 Next.js + react-three-fiber로 전체 이전함 (마이그레이션 계획: `~/.claude/plans/floofy-gliding-pine.md`).
- `index.html`은 **삭제하지 않고 참조용으로 유지 중** — 실제 서비스되는 페이지가 아니라 마이그레이션 시각 diff 기준점.
- 3D: `three` + `@react-three/fiber` + `@react-three/drei`. 현재 유일한 3D 요소는 히어로 배경의 별 파티클 필드(`components/Hero3D.jsx`, drei `<Stars>`) — 3D는 이 한 곳에만 집중, 다른 섹션엔 안 씀.
- **의존성 버전 주의**: `react`/`react-dom`은 `19.2.8`로 **정확히 고정**(caret 없음). `@react-three/fiber@9.x`가 `react: ">=19 <19.3"`를 요구해서, npm 최신 안정판인 19.3.0과 충돌함. `npm install` 시 이 핀을 건드리지 말 것.
- 스타일링: Tailwind나 CSS-in-JS 없이 기존 커스텀 프로퍼티 기반 CSS를 `app/globals.css`에 거의 그대로 이식. 폰트도 `next/font` 대신 기존 Google Fonts `<link>` 태그 유지.
- Next 16은 `next lint` 명령이 제거됨 — lint 설정/스크립트 없음 (요청받지 않았고, ESLint Flat Config로 새로 세팅하는 건 스코프 밖).
- 로컬: `npm run dev` (Turbopack). 배포 전 `npm run build && npm run start`로 프로덕션 빌드 확인 권장. 별도 테스트 스위트 없음.
- **Vercel 프로젝트 설정 주의**: `vercel project add`로 새로 만든 프로젝트는 Framework Preset이 기본값 "Other"로 생성됨 — 이 상태로 두면 `public/`(이미지만 있는 폴더)를 정적 사이트 루트로 서빙하려다 404가 남(실제로 겪음). `vercel project update <name> --framework nextjs --auto-detect output-directory`로 고쳐야 하고, 프리셋 바꾼 뒤엔 반드시 `vercel --prod --force`로 재배포해야 반영됨(설정 변경이 기존 배포에 소급 적용 안 됨).
- **배포/자동배포**: GitHub 리포(`jaeemin05/PIONEER`)와 `vercel git connect`로 연동해둠 — main 브랜치에 push하면 자동 배포됨.

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

## 이미지 (public/, 섹션별 하위 폴더로 정리됨)
Hero, Plaque Reveal, Heritage(spacecraft/plaque), Narrative 6개, Shop Signal 9개 + Origin 14개, System 3개 — 전부 실제 이미지 연결 완료. 폴더 구조와 각 슬롯 채우는 법은 `context-notes.md`의 "public/ 이미지 폴더 구조" 및 "이미지 슬롯 시스템(ImageSlot)" 항목 참고.
**아직 안 채워진 것**: `Experience` 섹션 이미지 1개만 남음 (`components/Experience.jsx`의 `EXPERIENCE_IMG`).

## 알려진 갭 (의도적으로 유지 중, "고쳐야 할 버그"로 착각하지 말 것)
- `pioneer-heritage.html` — 존재하지 않는 페이지, 링크만 유지.
- Signal "전체 보기", footer "Instagram" — `href="#"` 죽은 링크.
- 세션 폼 제출 — 실제 백엔드 없음, 클라이언트에서 성공 화면만 토글.
- 모바일 샵 스와이퍼는 로드 시 `window.innerWidth`를 1회만 체크 — 리사이즈해도 모드 안 바뀜(원본 동작 그대로 유지).

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
