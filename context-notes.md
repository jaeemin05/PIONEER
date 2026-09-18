# PIONEER Next.js 마이그레이션 — 컨텍스트 노트

## 배경
- 기존 index.html은 빌드 도구 없는 순수 정적 파일, Vercel에 zero-config 정적 배포 중.
- apple-design 스킬로 접근성 리뷰 후 `--text-dim`, `--warn` 토큰과 핑크 CTA 텍스트 색 수정을 index.html에 이미 적용함 (이 마이그레이션 이전 커밋).
- 사용자가 3D 요소 추가 + "디자인하기 편한 언어"를 요청 → React+Next.js+react-three-fiber로 전체 이전, 3D는 히어로 배경(별/파티클 필드) 한 곳에만 집중하기로 확정 (AskUserQuestion 2회).

## 결정 사항
- **index.html은 삭제하지 않고 참조용으로 유지.** 마이그레이션 끝날 때까지 시각적 diff 기준점.
- **CSS는 거의 그대로 app/globals.css로 이식.** Tailwind/CSS-in-JS 도입 안 함 — 요청받지 않았고 기존 커스텀 프로퍼티 시스템이 이미 잘 작동함.
- **next/font 대신 기존 <link> 태그 유지.** next/font로 옮기면 CSS 곳곳의 font-family 참조를 다시 맞춰야 해서 리스크만 있고 이득 없음.
- **TypeScript 안 씀.** 마케팅 사이트 + 인라인 스타일 이식이 많아서 타입 오버헤드가 안 맞음.
- **의존성 버전은 실행 시점 `@latest`로 설치.** 계획 당시(2026-09-17) npm 기준 Next 16 / React 19 / @react-three/fiber 9 / @react-three/drei 10이 서로 호환(peerDependencies 확인 완료). Plan 서브에이전트가 처음 제안한 Next 14 / React 18 / fiber v8 조합은 이미 낡은 정보였음 — npm view로 직접 검증 후 교체.
- **모바일 샵 스와이퍼의 "리사이즈 시 모드 안 바뀌는" 버그를 의도적으로 유지.** 원본도 `window.innerWidth > 900`을 로드 시 1회만 체크함. 마이그레이션 중 다른 버그를 몰래 고치지 않기 위함 (patiry 우선, 이번 스코프는 스택 교체이지 리디자인이 아님).
- **세션모달 트리거를 SessionModalContext로.** 원본은 `[data-session-open]` 쿼리셀렉터 방식인데, 트리거가 4곳(Header/Shop/Destination/Footer)에 흩어져 있어서 React에서는 Context가 자연스러운 대응. 오버엔지니어링 아님 — 실제 다중 사용처가 있는 경우에만 정당화됨.
- **죽은 셀렉터 정리.** 원본 JS의 `a[href="#destination"].btn-filled`/`.nav-cta` 셀렉터는 실제로 매치되는 요소가 없는 죽은 코드 — React 포팅 시 실제 트리거 4곳에 직접 onClick 연결.

## 알려진 갭 (마이그레이션 중 고치지 않음, 그대로 이식)
- hero-bg.jpg / spacecraft.jpg / plaque.jpg — 로컬에 파일 없음, 404 그대로 유지.
- pioneer-heritage.html — 존재하지 않는 페이지, 링크만 유지 (이번 스코프에서 만들지 않음).
- Instagram, "전체 보기" 링크 — `href="#"` 그대로.
- 세션 폼 제출 — 실제 백엔드 없음, 클라이언트 성공 화면만 토글.

## 의존성 버전 이슈 (실제로 부딪힌 문제)
- `@react-three/fiber@9.7.0`은 `peerDependencies`로 `react: ">=19 <19.3"`를 요구하는데, npm의 React 최신 안정 버전은 19.3.0이라 딱 걸림. `react@^19.2.8` 같은 caret 범위로 설치하면 새 패키지 추가 시 npm이 재해석하면서 다시 19.3.0으로 끌어올려버려서 ERESOLVE가 재발함.
- 해결: package.json에서 `react`/`react-dom`을 caret 없이 **정확히 `19.2.8`로 고정**. Next 16은 `react: "^18.2.0 || ^19.0.0"`처럼 넓게 허용해서 19.2.8과 문제 없음.
- 최종 설치 버전: next 16.3.5, react/react-dom 19.2.8(고정), three 0.186.0, @react-three/fiber 9.7.0, @react-three/drei 10.7.8 — 전부 `--save-exact`로 고정해서 향후 `npm install` 시 같은 충돌이 재발하지 않도록 함.

## public/ 이미지 폴더 구조 (섹션별 정리)
```
public/
├── hero/hero-bg.jpg
├── heritage/spacecraft.jpg, plaque.jpg
├── plaque-reveal/origin-plaque-mockup.png
├── narrative/S01.jpg ~ S06.jpg
└── shop/
    ├── signal/sig01.png ~ sig09.png
    └── origin/org01.png ~ org14.png
```
각 컴포넌트의 `src`/`img` 경로도 전부 이 구조에 맞춰 `/섹션/파일명`으로 수정해둠. 앞으로 새 이미지 추가할 때도 이 폴더 규칙(섹션 이름의 하위 폴더)을 따를 것.

## 이미지 슬롯 시스템 (ImageSlot)
- Narrative(6) / Shop Signal·Origin(6) / Experience(1) / SystemSection(3) — 총 13곳의 남은 플레이스홀더를 `components/ImageSlot.jsx` 하나로 통일함.
- 각 데이터 배열/변수에 `img: null` 필드를 추가해뒀고, `null`이면 기존 점선 플레이스홀더(`.ph`/`.ph-dark`/`.ph-light`)를 그대로 보여주고, 파일 경로 문자열을 넣으면 바로 `<img>`로 전환됨.
- 실제 이미지를 넣을 때는: `public/`에 파일 추가 → 해당 컴포넌트의 데이터에서 `img: null`을 `img: '/파일명'`으로 바꾸면 끝.
- HeritageTeaser/PlaqueReveal은 이 시스템 이전에 이미 실제 `<img>`로 직접 연결해둔 상태라 ImageSlot을 안 씀 (일관성보다 이미 동작하는 걸 안 건드리는 쪽 선택).

## 실제로 겪은 버그: 한글 파일명 → Next 서버 에러
- 사용자가 준 `파이오니어_오리진라인_폰케이스_목업6.png` 파일을 `<img src>`에 그대로 썼더니, 개발 서버 로그에 `TypeError: Invalid character in header content ["Link"]`가 반복적으로 찍힘. Next가 이미지 프리로드용 `Link` HTTP 헤더를 만들 때 비-ASCII 문자를 그대로 넣어서 발생하는 것으로 보임. 페이지 자체는 200으로 응답해서 눈에 안 띄지만, 배포 환경(Vercel Edge)에서는 헤더 검증이 더 엄격해서 문제될 수 있음.
- 해결: 파일을 `public/origin-plaque-mockup.png`로 리네임하고 참조 경로 수정. **앞으로 `public/`에 넣는 파일은 영문/숫자/하이픈 파일명 권장** — 한글 파일명은 URL 자체는 브라우저가 인코딩해서 이미지 로딩은 되지만, Next의 헤더 생성 로직과는 충돌함.

## 실제로 겪은 버그: `<img>` + position:absolute + inset:0 만으로는 안 채워짐
- 반응형 대응한다고 `<img>`에 `position:absolute; inset:0;`만 주고 `width`/`height`를 뺐더니, 실제로는 이미지가 원본 크기(예: 4000×3000) 그대로 렌더링되고 왼쪽 위 모서리만 잘려 보이는 문제가 생김 — `object-fit: cover`가 전혀 적용 안 된 것처럼 보였음.
- 원인: `<img>`는 "replaced element"라서, `position:absolute`에 `inset:0`만 주고 width/height가 `auto`면 CSS가 부모를 채우도록 늘리지 않고 **이미지의 intrinsic(원본) 크기**를 그대로 씀. (non-replaced 요소인 일반 `<div>`였다면 inset:0만으로도 채워졌을 것 — `<img>`라서 다른 규칙이 적용됨.)
- 해결: `position:absolute; inset:0;`에 **`width:'100%', height:'100%'`를 반드시 같이 명시**. 이 조합이어야 `object-fit`/`object-position`이 실제로 작동함. `components/ImageSlot.jsx`, `PlaqueReveal.jsx`, `HeritageTeaser.jsx` 전부 이 패턴으로 통일함.
- 확인 방법: Playwright로 스크린샷을 못 찍는 상황(Hero3D 캔버스 때문에 계속 타임아웃)이라, `getBoundingClientRect()`로 부모/이미지 박스 크기가 정확히 일치하는지 직접 측정해서 검증함.

## 배포 관련
- Vercel 프로젝트의 Framework Preset을 "Other"(정적)에서 "Next.js"로 바꿔야 함 — 코드 변경이 아니라 Vercel 대시보드에서 사용자가 직접 해야 하는 설정 변경. 배포 전에 안내 필요.
