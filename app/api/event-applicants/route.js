// /event 신청 폼이 쌓이는 구글 시트를 관리자 비밀번호로 확인해서 읽어오는 프록시.
// 실제 시트 URL/토큰은 서버에만 두고, 비밀번호는 GET 쿼리가 아니라 POST 바디로
// 받아서 서버 로그에 남지 않게 함.
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
    if (Array.isArray(data.rows)) data.rows = await withReferrerNames(data.rows);
    return Response.json(data);
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 502 });
  }
}

// 시트의 '유입코드'(지역원 추천 코드)를 또치 서버에 물어 '유입자'(이름·지역) 컬럼을 바로 옆에 붙임.
// 코드→지역원 해석 비밀키는 또치에만 있어서 여기선 서버 간 호출만 함. 실패하면 표는 그대로 보여줌.
async function withReferrerNames(rows) {
  const apiUrl = process.env.DDOCHI_API_URL;
  const key = process.env.PIONEER_INTERNAL_KEY;
  const codes = [...new Set(rows.map((r) => String(r['유입코드'] || '').trim()).filter((c) => c && c !== 'direct'))];
  if (!apiUrl || !key || codes.length === 0) return rows;

  let members = {};
  try {
    const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/referral/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Pioneer-Key': key },
      body: JSON.stringify({ codes }),
      cache: 'no-store',
    });
    const data = await res.json();
    if (data.ok) members = data.members || {};
  } catch {
    return rows;
  }

  return rows.map((row) => {
    const code = String(row['유입코드'] || '').trim();
    const m = members[code];
    const label = !code || code === 'direct' ? '' : m ? `${m.name}${m.region ? ` (${m.region}지역)` : ''}` : '알 수 없음';
    const out = {};
    for (const [k, v] of Object.entries(row)) {
      out[k] = v;
      if (k === '유입코드') out['유입자'] = label;
    }
    return out;
  });
}
