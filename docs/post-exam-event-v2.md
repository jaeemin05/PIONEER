# 수험생 이벤트 V2

- 경로: `/event/v2` (기존 `/event`, 홈, 관리자 페이지 유지)
- 작업 기준: main `7f2d7eda7060956e22239b021676ab866a0be3a0`
- 참고 자료: `feature/after-exam-research`의 `4f801d3e22f145267c943934cd324a86bae19fff`
  - `PIONEER_A_01.png`: 검정 배경, 큰 오렌지 헤드라인, 행성 케이스 중심 구성
  - `PIONEER_A_02.png`: 취향 이야기 → PLANET 디자인 → 제작 과정
  - `PIONEER_A_03.png`: 밝은 종이색 혜택 카드와 명확한 신청 CTA
  - `2026 수능종료 광고시장 리서치` MD: 첫 화면에서 혜택·대상·지역·행동 전달, 실제 제공물 중심, 조건과 신청 과정 단순화

참고 자료 브랜치를 병합하거나 수정하지 않았다. 이미지 03의 미확정 ‘선착순 30명’과 기존 소재의 더 넓은 지역 표기를 옮기지 않았다. 광고 이미지의 작은 글자를 통째로 축소하는 대신 실제 HTML 텍스트와 기존 제품 이미지 `org08.png`, `org03.png`로 모바일에 맞게 재구성했다. 제공물 이미지는 디자인 예시로 표시한다. 배송비, 미확정 정원·마감일·소요시간은 표기하지 않는다.

## 신청 동작

모집 시작은 **2026-10-29 00:00 Asia/Seoul**. 그 전에는 미리 작성 화면을 열 수 있지만 접수 버튼은 비활성화되고 API도 접수를 차단한다. 시작 이후에는 이름, 휴대폰 번호, 서울/경기남부 지역, 수험생 확인, 개인정보 동의를 검증한다. 취향 키워드는 선택 사항이다. URL의 `ref`는 기존 `pioneer-ref` 세션 저장 방식과 호환된다.

네이티브 dialog로 키보드 포커스 제한, ESC 닫기, 트리거로 포커스 복귀, 배경 스크롤 잠금을 지원한다. 전송 중 중복 제출을 막고, 오류 시 입력을 유지한다. 서버가 확인한 성공에만 접수 완료를 표시한다.

## 운영 연결과 남은 확인

`/api/post-exam-applications`가 서버에서 기존 `NEXT_PUBLIC_EVENT_SCRIPT_URL`로 POST한다. 기존 시트 필드 `source: event-page`, `name`, `contact`, `region`, `words`, `birthYear`, `matchedPlanets`, `referrer`를 유지하고 `campaign: post-exam-v2`를 보낸다. 최소 수집을 위해 출생연도·행성 유형은 빈 값이다. 이 필드 조합을 Apps Script가 수락하는지는 실제 운영 연결에서 확인해야 한다.

- 허용 주소 형식: `https://script.google.com/macros/s/<deployment-id>/exec`
- Apps Script가 정상 저장 후 JSON `{ "ok": true }`를 반환해야 한다. HTML 로그인 화면, 비정상 HTTP 상태, `{ok:false}`, 타임아웃은 완료로 처리하지 않는다.
- URL 미설정 시 503으로 접수를 중단한다. 임시 성공 처리나 브라우저 콘솔 개인정보 출력은 없다.
- 현재 클라우드에는 URL이 설정되지 않았다. 실제 개인정보 전송은 수행하지 않았다. 서버 테스트의 upstream 및 브라우저 성공 응답은 모의 응답이다.
- 실접수 활성화 전에 배포 환경의 URL, Apps Script 공개 접근/응답 계약 및 빈 필드 허용 여부, 실제 시트 저장을 확인해야 한다. 클라우드에서 연동을 검증하려면 `script.google.com` 및 리디렉션 목적지 `script.googleusercontent.com` 네트워크 허용이 필요하다.
- 개인정보 안내의 보유 기간은 기존 이벤트 양식의 ‘이벤트 종료 후 30일’을 따른다. 실제 운영 방침과 일치 여부를 배포 전에 확인한다.
- 신규 공개 접수 API에는 별도 지속형 남용 방지 저장소를 추가하지 않았다. 운영 인프라의 요청 제한 설정을 함께 검토한다.

## 검증

```bash
node --test tests/post-exam.test.mjs
NEXT_TELEMETRY_DISABLED=1 npm run build
NEXT_TELEMETRY_DISABLED=1 npm run start -- --hostname 127.0.0.1 --port 3002
BASE_URL=http://127.0.0.1:3002 node tests/post-exam.browser.cjs
```

브라우저 검증은 클라우드 기본 제공 `playwright`, `/usr/bin/chromium`을 이용한다. 앱 의존성/잠금 파일은 변경하지 않았다. 테스트는 실제 신청을 보내지 않는다.

- 서버 테스트 17개: 한국 시간 경계, 시작 전 차단, 잘못된 JSON/크기/지역/연락처/동의, 교차 출처 요청, URL 미설정, 전달 필드, 확인된 성공과 실패 응답
- 320/390/768/1440px: 수평 넘침 없음, 금지된 조건 문구 없음, 모집 전 안내, 모달/ESC/포커스 복귀
- 390px: 모집 후 입력 오류/첫 오류 포커스, 선택 키워드, 동의서, ref 전달, 실패 시 입력 유지, 재시도 후 확인된 성공, 스크롤 잠금 해제
- 기존 `/`, `/event`, `/admin` 200 응답 유지, 브라우저 JavaScript 오류 없음
- Google Fonts는 현재 클라우드 네트워크 정책에서 차단되어 대체 글꼴로 검증했다.
