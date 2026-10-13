// /event 신청 폼이 쌓이는 구글 시트를 관리자 비밀번호로 확인해서 읽어오는 프록시.
// 실제 시트 URL/토큰은 서버에만 두고, 비밀번호는 GET 쿼리가 아니라 POST 바디로
// 받아서 서버 로그에 남지 않게 함.
//
// 유입코드→지역원 이름 해석은 여기(Vercel)에서 하지 않음: Cloudflare Bot Fight Mode가
// Vercel 서버 egress를 막아 또치 서버 호출이 항상 실패했음(HTML 챌린지 응답).
// 대신 Apps Script(Google 인프라, 차단 안 됨)가 시트에 쓰는 시점에 이미 이름으로 바꿔서 저장함.
export async function POST(request) {
  const { pw } = await request.json().catch(() => ({}));

  if (!process.env.ADMIN_PW || pw !== process.env.ADMIN_PW) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const scriptUrl = process.env.NEXT_PUBLIC_EVENT_SCRIPT_URL;
  const token = process.env.EVENT_SHEETS_SECRET;

  if (!scriptUrl || !token) {
    return Response.json(
      { ok: false, error: 'NEXT_PUBLIC_EVENT_SCRIPT_URL 또는 EVENT_SHEETS_SECRET이 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    const url = `${scriptUrl}?action=list&token=${encodeURIComponent(token)}`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 502 });
  }
}
