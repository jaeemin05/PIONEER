import { RECRUITMENT_START, validateApplication } from "./post-exam.mjs";

export async function submitPostExam(
  request,
  { now = Date.now(), scriptUrl, fetchImpl = fetch } = {},
) {
  const reply = (body, status) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return reply(
      { ok: false, error: "신청 페이지에서 다시 시도해주세요." },
      403,
    );
  if (now < RECRUITMENT_START)
    return reply({ ok: false, error: "10월 29일부터 신청할 수 있어요." }, 403);
  if (Number(request.headers.get("content-length")) > 4096)
    return reply({ ok: false, error: "신청 정보가 너무 깁니다." }, 413);
  let data;
  try {
    const text = await request.text();
    if (text.length > 4096)
      return reply({ ok: false, error: "신청 정보가 너무 깁니다." }, 413);
    data = JSON.parse(text);
  } catch {
    return reply({ ok: false, error: "신청 정보를 확인해주세요." }, 400);
  }
  const errors = validateApplication(data);
  if (Object.keys(errors).length)
    return reply(
      { ok: false, errors, error: "입력한 내용을 확인해주세요." },
      400,
    );
  if (!scriptUrl)
    return reply(
      {
        ok: false,
        error: "현재 접수를 준비 중이에요. 잠시 후 다시 방문해주세요.",
      },
      503,
    );
  try {
    const url = new URL(scriptUrl);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "script.google.com" ||
      !/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname)
    )
      throw new Error("configuration");
    const payload = {
      source: "event-page",
      campaign: "post-exam-v2",
      name: data.name.trim(),
      contact: data.contact.replace(/[-\s]/g, ""),
      region: data.region,
      birthYear: "",
      words: [...new Set(data.words)].join(", "),
      matchedPlanets: "",
      referrer:
        typeof data.referrer === "string" &&
        /^[A-Za-z0-9_-]{1,32}$/.test(data.referrer)
          ? data.referrer
          : "direct",
    };
    const response = await fetchImpl(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    if (!response.ok || (await response.json()).ok !== true)
      throw new Error("unconfirmed");
    return reply({ ok: true }, 200);
  } catch {
    return reply(
      {
        ok: false,
        error:
          "접수를 확인하지 못했어요. 입력 내용은 유지됩니다. 잠시 후 다시 시도해주세요.",
      },
      502,
    );
  }
}
