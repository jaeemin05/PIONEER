# PIONEER 코드 검사 및 리팩터링 준비

검사일: 2026-10-04 (Asia/Seoul). 기준 커밋: `53366a5ebe471fe67786d2213234334ed639c449`. 작업 브랜치: `refactor/repository-audit`, base: `main`.

이번 변경은 작업 규칙과 검사 결과의 문서화다. 아래 애플리케이션 결함은 아직 수정하지 않았다. 동작을 보존하는 구조 정리와 기능·결함 수정은 별도 PR로 진행한다.

## 검사 범위와 현재 구조

기존 추적 파일 86개를 기준으로 `app/`, `components/`, `hooks/`의 소스 39개 전체, 설정·의존성·문서·레거시 파일 10개를 검사했다. `index.html`은 전체 CSS·마크업·스크립트를 읽었으며 라이브 앱과 구분했다. `public/` 37개는 목록·용량·소스 참조를 확인했다. 이미지의 시각적 완성도, 모든 브라우저/GPU, 운영 서비스는 검사하지 않았다.

| 영역 | 현행 구조 | 리팩터링 경계 |
| --- | --- | --- |
| 홈 | `app/page.js`, 섹션 컴포넌트, SessionModalProvider | 섹션 순서·카피·디자인을 유지하며 데이터와 상호작용 분리 |
| 이벤트 | `app/event/page.js`, EventApplyProvider, 신청 Sheet | 유형 매칭·입력 검증·제출·dialog 동작 분리 |
| 관리자 | `app/admin/page.js`, AdminApplicants, event-applicants API | 조회 계약·인증 상태·응답 검증·표시 분리 |
| 시각 효과 | 홈 별/셰이더 Canvas 2개, 이벤트 셰이더 Canvas 1개 | 공통 설정과 표시·모션 정책 검토 |
| 스타일 | `app/globals.css` 2,044행, 전역 및 페이지별 규칙 | cascade 순서를 보존하며 작은 단위로 분리 |
| 레거시 | `index.html` 1,795행 | 참조용 유지; 현행 화면의 완전한 기준으로 사용하지 않음 |

## 우선 검토할 문제

P1은 실제 신청 유실을 숨길 수 있는 동작이다. P2는 오류 처리·키보드·접근성·동작 개선이다. 위치의 행 번호는 기준 커밋에 해당한다.

| 우선순위 | 위치 | 확인 내용 | 근거 / 후속 검증 |
| --- | --- | --- | --- |
| P1 | `components/event/EventApplyForm.jsx:173` | URL이 설정된 실제 전송도 `no-cors`와 `.catch(finish)` 때문에 실패 시 성공 화면으로 전환한다. 저장 성공 여부를 확인할 수 없다. | 코드 확인. 확인 가능한 저장 응답 계약을 먼저 결정하고 성공·거절·HTTP 오류·timeout 검증. 미설정 URL의 preview 동작과 구분 |
| P2 | `app/api/event-applicants/route.js:5` | JSON `null`을 구조 분해해 예외가 발생한다. | 실제 로컬 프로덕션 서버에서 500/non-JSON 재현. 객체·pw 타입을 검증하고 일관된 오류 응답 제공 |
| P2 | `app/api/event-applicants/route.js:23`, `components/admin/AdminApplicants.jsx:30` | upstream HTTP 상태와 `rows` 구조를 검증하지 않는다. 문자열 rows는 `.slice().reverse()`에서 관리자 UI를 깨뜨린다. | 격리된 mocked 호출에서 503을 200으로 전달하고 문자열 rows도 수용함을 확인. schema·timeout·오류 메시지 경계 필요 |
| P2 | `components/event/EventApplyContext.jsx:15`, `components/event/EventSelect.jsx:15` | 출생연도 메뉴의 Escape가 전체 신청 Sheet도 닫아 입력을 잃는다. | 브라우저에서 이름 입력 → 메뉴 열기 → Escape → Sheet 재열기 시 빈 이름 재현. 가장 안쪽 레이어부터 닫기 |
| P2 | `components/event/EventApplySheet.jsx:17`, `components/SessionModal.jsx:16` | 이벤트 Sheet의 초기 포커스가 배경에 남는다. 두 dialog 모두 포커스 제한·복원이 없고 SessionModal의 body 잠금에는 unmount cleanup이 없다. | 이벤트 포커스는 브라우저 재현, 나머지는 코드 확인. Tab/Shift+Tab·닫기·라우트 이동 후 스크롤 검증 |
| P2 | `components/Narrative.jsx:122` | document 화살표 핸들러가 세션 입력 필드에도 반응한다. | Narrative가 보일 때 모달 입력에서 ArrowRight → 배경 슬라이드 카운터 변경 재현 |
| P2 | `components/ShopCarousel.jsx:164` | `scrollWidth / 2`가 복제 카드 사이의 실제 반복 거리와 다르다. gap 100px에서 약 50px 경계 오차가 생긴다. | 브라우저 측정: halfWidth 3668.5px, 동일 복제 카드 offset 3719px. 실제 카드 offset으로 측정하는 경계 검증 필요 |
| P2 | `components/ShopCarousel.jsx:30` | 모바일의 원본·복제본 모두 `aria-hidden=true`다. | 390px 브라우저에서 69개 상품 카드 전부 숨김 확인. 원본은 접근 가능하게 유지 |
| P2 | `components/event/EventApplyForm.jsx:141` | 연락처는 비어 있는지만 검사하므로 숫자 한 자리도 허용한다. | 코드 확인. 이벤트 전화번호 정책에 맞는 검증 필요; 전화/Instagram을 함께 허용하는 세션 입력과 분리 |
| P2 | `components/admin/AdminApplicants.jsx:40` | sessionStorage 읽기 예외를 처리하지 않는다. 비밀번호 원문 저장 정책도 검토가 필요하다. | 코드 확인. 저장소 차단 브라우저 검증 및 인증 정책 검토; 배포 환경의 보안 설정까지 확인한 취약점으로 단정하지 않음 |

추가 UI 검사 결과:

- `ShopCarousel.jsx:201`: 첫 위치에서 이전 이동은 음수 scrollLeft가 0으로 제한되므로 루프하지 못한다. 코드상 경계 결함이며 별도 브라우저 경계 테스트가 필요하다.
- `EventPopup.jsx:39`: 자동 팝업에 dialog 의미, Escape 닫기, 초기 포커스·제한·복원 처리가 없다.
- `EventStickyCta.jsx:29`, `globals.css:1741`: 숨긴 CTA를 transform으로만 화면 밖에 두므로 여전히 focus 대상이다.
- `EventFaq.jsx:29`, `globals.css:1562`: 펼침 상태와 답변 숨김을 접근성 속성에 연결하지 않는다.
- `globals.css:1726`의 reduced-motion transition 제거는 뒤의 `:1742` 규칙에 덮인다. WebGL과 자동 캐러셀도 reduced-motion을 반영하지 않는다.
- `SessionModal.jsx:8`: 제출 후 닫고 다시 열어도 성공 화면이 남고 입력 폼은 없다. 브라우저에서 확인했다. 반복 신청을 허용할지는 관리자 결정 사항이다.

## 구조·성능·문서 정리 후보

- `Shop.jsx`의 상품 배열과 `EventApplyForm.jsx`의 행성 유형·매칭·전화번호 처리·검증을 UI에서 분리한다. 매칭 결과·순서·전화번호 표시가 보존되는 검증을 먼저 둔다.
- 모달의 focus/Escape/body 잠금과 캐러셀의 측정/제스처/자동재생을 각각 독립 경계로 만든다. 이름만 같은 두 UI를 무리하게 하나로 합치지 않는다.
- ImageSlot 등 현재 이미지들은 eager 일반 img다. 상품 원본 23개는 약 7.43 MiB, 목업은 약 3.18 MiB다. 화면 아래 이미지 지연 로딩과 크기 정책을 측정 후 검토한다. 같은 URL 복제 카드가 다운로드를 복제 수만큼 늘린다는 뜻은 아니다.
- 화면 밖에서도 홈 WebGL·자동 캐러셀의 프레임 루프가 실행된다. visibility와 reduced-motion 정책을 검토한다. 현재 측정 없이 성능 향상 수치를 주장하지 않는다.
- `useFadeIn.js`는 visible 이후에도 관찰을 유지한다. 일회성 reveal/공유 observer를 검토하되 표시 타이밍을 보존한다.
- `package.json`에는 test/lint 명령이 없고 CI·런타임 버전 핀도 없다. 현재 Linux lockfile은 camera-controls의 Node >=22/npm >=10.5.1을 요구한다. 검증된 환경은 Node 24.19.0/npm 11.9.0이다. lint·TypeScript·새 프레임워크 도입은 이번 문서 변경에 포함하지 않는다.
- 직접 import가 없는 `camera-controls`, `three-stdlib`는 직접 선언 정리 후보다. drei의 전이 의존성이므로 제거하면 설치 크기가 줄어든다고 단정하지 않는다. `three` peer와 React/ReactDOM 19.2.8 핀은 보존한다.
- `public/heritage/plaque.jpg`, `public/system/{World,Moment,Coordinates}.jpg`와 `.hero-bg`, `.shop-paths`는 현재 앱의 정적 참조에서 발견되지 않았다. 외부 이미지 URL 사용과 동적 참조를 확인하기 전 삭제하지 않는다.
- `CLAUDE.md`의 Experience·단일 3D 설명, context-notes/checklist의 이미지 404 기록은 현재 코드와 다르다. 현재 지침과 역사 기록을 구분해 후속 문서 PR에서 정리한다.
- 미재현 후보: 모바일 초기 `isMobile=false`와 WebGL antialias 생성 순서, 텍스처/WebGL 오류 시 fallback, 초기 스크롤 복원 상태. 실제 기기·장애 주입 검증 전 확정 결함으로 취급하지 않는다.

## 보존할 동작과 관리자 결정

- `index.html`은 참조용으로 유지한다. 레거시의 상품 구성·Experience·이미지 경로는 현행과 달라 시각 회귀 기준은 현재 앱에서 새로 잡는다.
- 세션 폼은 문서화된 UI-only 성공 동작이다. 실제 접수 기능 추가는 별도 기능 작업이다.
- 모바일 Shop의 폭 판정은 로드 시 한 번만 수행한다. 리사이즈에 따른 모드 변경은 문서화된 기존 동작의 변경이다.
- Signal 전체 보기·Instagram의 `href="#"`는 알려진 동작이다.
- 이벤트 URL 미설정 시 preview 성공은 코드에 명시돼 있다. 실제 전송 실패의 성공 오인(P1)과 별도로 취급한다.
- 홈페이지 Heritage 페이지 링크는 현행 앱에 없고 레거시에만 남아 있다. 과거 문서만 근거로 링크를 복원하지 않는다.
- 한국어 카피, 섹션 순서, CSS 토큰과 색상 의미, 행성 분류·동점 처리, 상품 배열 순서, Sheet 입력 유지/초기화 정책을 리뷰 기준으로 삼는다.

## 실행한 검증

모든 이번 검증은 `refactor/repository-audit`에서 수행했다. 외부 신청자 데이터·Google Sheets·추천 서버에는 요청하지 않았다.

| 검사 | 결과 | 의미 / 한계 |
| --- | --- | --- |
| `NEXT_TELEMETRY_DISABLED=1 npm run build` | 통과 | Next 16.3.5의 `/`, `/event`, `/admin`, API 빌드 성공 |
| 로컬 `npm run start -- --hostname 127.0.0.1 --port 3002` + HTTP 요청 | 주요 페이지 3개 통과 | 200과 페이지별 예상 텍스트 확인 |
| API `{}`, malformed JSON, `[]`, 잘못된 pw | 예상 401 JSON 확인 | 현재 외부 연동 값 없이 인증 거부 경로 검증 |
| API JSON `null` | 결함 재현: 500/non-JSON | 통과로 집계하지 않음 |
| 격리된 API mock | 응답 계약 결함 재현 | upstream 503/잘못된 rows 전달 확인; 실제 외부 연동은 미검증 |
| Chromium/Playwright 로컬 UI | 정상 동작 4개 확인 | 이벤트 열기·scroll lock, 닫기·해제, 의도된 세션 성공, 관리자 잘못된 비밀번호 피드백 |
| Chromium/Playwright 관찰 | 현행 문제/정책 6개 재현 | Sheet 포커스, Escape 입력 손실, 세션 재열기 상태, 모달 화살표 간섭, 반복 거리 오차, 모바일 aria-hidden |

브라우저는 클라우드에 이미 설치된 Playwright와 `/usr/bin/chromium`을 사용했고 저장소 의존성은 추가하지 않았다. 외부 HTTPS는 차단해 운영 요청을 막았다. 첫 이벤트 CTA 클릭은 계속 움직이는 요소에 대한 Playwright 안정성 대기에서 timeout이 났다. 재시도는 `click({ force: true })`로 안정성 대기를 건너뛰어 **상태·이벤트 처리**를 확인했다. 따라서 실제 클릭 hit target·애니메이션 안정성·실제 GPU 품질까지 검증했다고 보지 않는다. 브라우저 스크립트는 `/tmp`의 일회성 검사이며 추적 테스트 스위트가 아니다.

## 권장 PR 순서와 완료 기준

| 순서 | 브랜치 예시 | 범위 | 완료 기준 |
| --- | --- | --- | --- |
| 1 | `feature/refactor-regression-baseline` | 현행 화면·상호작용·API 계약을 검증하는 기반 | 390/900/1440px, 성공·실패·Escape·Tab·경계 이동·reduced-motion·WebGL/텍스처 실패 검증. 결함 재현은 기대 실패로 구분 |
| 2 | `fix/event-submission-errors` | 실제 저장 응답 확인, 실패·timeout 안내 | 성공 응답에만 성공 표시. preview 정책 분리. 관리자와 Apps Script 계약 확정 |
| 3 | `fix/applicants-api-validation` | 요청 객체·upstream 상태/rows 검증 | null·타입 오류·외부 장애에 일관된 JSON; 정상/빈 rows·추천 조회 실패 fallback 검증 |
| 4 | `fix/dialog-keyboard-lifecycle` | 공통 focus/Escape/scroll 복원, 입력 키 범위 | dropdown Escape는 Sheet 유지; Tab 제한·닫기 복원·이동 cleanup; 재신청 정책 확정 |
| 5 | `fix/carousel-loop-accessibility` | 반복 거리·이전 경계·원본 접근성 | 반복 위치 오차 1px 이내, 앞/뒤 wrap, 모바일 수평 swipe·세로 pan·원본 접근성 |
| 6 | `fix/ui-accessibility-and-motion` | 자동 팝업·숨김 CTA·FAQ·reduced-motion | dialog 키보드 동작, 숨김 CTA 포커스 제외, FAQ 상태/숨김 동기화, CSS·JS·WebGL 모션 정책 확인 |
| 7 | `refactor/content-and-ui-boundaries` | 도메인/상품 데이터, 이미지·reveal·scroll 경계 | 카피·분류·순서·동작 보존; 새 공통 추상화는 실제 중복에 한정 |
| 8 | `refactor/styles-and-dependencies` | CSS cascade·죽은 코드·직접 의존성·현행 문서 | 작은 PR, 화면 비교·build·핵심 UI 검증. React 핀/레거시 유지 |

운영 연동의 성공 계약, 반복 신청·Sheet 입력 보존, 비밀번호 보관, reduced-motion 동작은 관리자가 검토할 사항이다. 이번 준비 브랜치는 결함 수정이나 배포를 포함하지 않으며 PR을 직접 병합하지 않는다.
