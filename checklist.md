# PIONEER Next.js 마이그레이션 체크리스트

계획 원본: `~/.claude/plans/floofy-gliding-pine.md`

## 0. 준비
- [x] Plan 승인
- [x] checklist.md / context-notes.md 생성

## 1. 스캐폴드
- [x] package.json, next.config.js, jsconfig.json, .gitignore (.eslintrc.json은 Next 16에서 `next lint` 제거로 무의미해져 안 만듦 — context-notes 참고)
- [x] `npm install` (next/react/react-dom)
- [x] `npm run dev`로 빈 페이지 확인

## 2. 전역 CSS/폰트
- [x] app/globals.css로 <style> 블록 이식 (index.html에서 직접 추출 — 오탈자 방지)
- [x] app/layout.js에 Google Fonts <link> + HTML shell

## 3. 정적 섹션 (Header → Footer 순서로 하나씩 확인하며 진행)
- [x] Header (마크업만, 스크롤 로직 전)
- [x] Hero (3D 없이 flat 상태)
- [x] hooks/useFadeIn.js
- [x] Opening
- [x] PlaqueReveal
- [x] HeritageTeaser
- [x] Experience
- [x] Destination
- [x] SystemSection
- [x] Footer

## 4. 인터랙티브 섹션
- [x] Narrative (슬라이더: dots/arrows/swipe/drag/keyboard)
- [x] Shop + ShopCarousel (모바일 무한루프 스와이퍼 포함)
- [x] SessionModalContext + SessionModal (열기/닫기/ESC/오버레이/바디스크롤락/검증)
- [x] Header/Shop/Destination/Footer에 모달 트리거 연결

## 5. Hero3D
- [x] three / @react-three/fiber / @react-three/drei 설치 (버전 충돌 있었음 — context-notes 참고)
- [x] Hero3D.jsx 작성 (drei Stars)
- [x] Hero.jsx에 적용, z-index/겹침 확인 — 스크린샷으로 확인 완료

## 6. 검증
- [x] 로컬 전체 클릭스루 (내비/모달/슬라이더/스와이퍼) — Playwright로 확인:
  - 헤더 스크롤 상태 전환 OK
  - fade-in 관찰자 정상 작동 (16개 중 스크롤 위치에 맞게 visible 적용)
  - 모달: nav-cta로 열기, ESC로 닫기, 빈 필드 제출 시 `--warn` 테두리, 정상 제출 시 성공 화면 전환 — 모두 OK
  - 내러티브 슬라이더: 화살표 버튼/카운터/dot/키보드(ArrowRight) 전부 동기화 확인
  - 모바일(390px) 샵 스와이퍼: 3배 복제 트랙, 실제 아이템이 중앙(인덱스 3)에 위치 확인, 스크린샷으로 시각 확인
- [x] index.html과 비교 — 스크린샷 diff는 생략(육안 확인으로 충분한 규모), 대신 각 섹션 텍스트/구조를 grep으로 원본과 대조
- [x] 알려진 갭 그대로 유지 확인 (spacecraft.jpg/plaque.jpg 404 유지, hero-bg.jpg는 3D로 대체되어 더 이상 404 아님 — 의도된 변경, pioneer-heritage.html 링크 유지, 죽은 링크들 유지, 폼 백엔드 없음 유지)

## 7. 배포
- [ ] Vercel Framework Preset을 Next.js로 변경 (대시보드, 코드 밖 작업 — 사용자가 직접 해야 함, 아래 안내 참고)
- [x] CLAUDE.md 스택 섹션 업데이트
- [x] `npm run build` 프로덕션 빌드 성공 확인 (정적 프리렌더링 OK)
