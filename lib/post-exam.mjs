export const RECRUITMENT_START = Date.parse("2026-10-29T00:00:00+09:00");
export const REGIONS = ["서울", "경기남부"];
export const WORDS = [
  "자유로운",
  "차분한",
  "도전적인",
  "다정한",
  "호기심 많은",
  "열정적인",
];
export function validateApplication(data) {
  const errors = {};
  if (!data || typeof data !== "object" || Array.isArray(data))
    return { form: "신청 정보를 확인해주세요." };
  if (
    typeof data.name !== "string" ||
    !data.name.trim() ||
    data.name.trim().length > 40
  )
    errors.name = "이름을 40자 이내로 입력해주세요.";
  if (
    typeof data.contact !== "string" ||
    !/^01[016789]\d{7,8}$/.test(data.contact.replace(/[-\s]/g, ""))
  )
    errors.contact = "휴대폰 번호를 확인해주세요.";
  if (!REGIONS.includes(data.region))
    errors.region = "참여 지역을 선택해주세요.";
  if (data.examinee !== true)
    errors.examinee = "수험생 대상 이벤트임을 확인해주세요.";
  if (data.agree !== true) errors.agree = "개인정보 수집·이용 동의가 필요해요.";
  if (
    !Array.isArray(data.words) ||
    data.words.length > WORDS.length ||
    data.words.some((word) => !WORDS.includes(word))
  )
    errors.words = "취향 키워드를 다시 선택해주세요.";
  return errors;
}
