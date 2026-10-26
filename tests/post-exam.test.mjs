import test from "node:test";
import assert from "node:assert/strict";
import { RECRUITMENT_START, validateApplication } from "../lib/post-exam.mjs";
import { submitPostExam } from "../lib/submit-post-exam.mjs";

const valid = {
  name: "테스트",
  contact: "010-1234-5678",
  region: "서울",
  words: ["자유로운"],
  examinee: true,
  agree: true,
  referrer: "test_ref",
};
const scriptUrl = "https://script.google.com/macros/s/test/exec";
const request = (body = valid, origin = "https://pioneer.test") =>
  new Request("https://pioneer.test/api/post-exam-applications", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin },
    body: JSON.stringify(body),
  });
const options = { now: RECRUITMENT_START, scriptUrl };

test("opening is October 29 at midnight Korea time", () =>
  assert.equal(
    new Date(RECRUITMENT_START).toISOString(),
    "2026-10-28T15:00:00.000Z",
  ));
test("valid request accepts optional empty keywords and both regions", () => {
  for (const region of ["서울", "경기남부"])
    assert.deepEqual(validateApplication({ ...valid, region, words: [] }), {});
});
test("invalid contact, unsupported region, and missing consents are rejected", () => {
  const errors = validateApplication({
    ...valid,
    name: " ",
    contact: "123",
    region: "부산",
    examinee: false,
    agree: false,
    words: ["invalid"],
  });
  assert.deepEqual(Object.keys(errors), [
    "name",
    "contact",
    "region",
    "examinee",
    "agree",
    "words",
  ]);
  assert.ok(validateApplication(null).form);
});
test("before opening, never sends to upstream", async () => {
  const result = await submitPostExam(request(), {
    ...options,
    now: RECRUITMENT_START - 1,
    fetchImpl: () => assert.fail("must not send"),
  });
  assert.equal(result.status, 403);
});
test("cross-origin submissions are rejected", async () =>
  assert.equal(
    (await submitPostExam(request(valid, "https://other.test"), options))
      .status,
    403,
  ));
test("invalid JSON is rejected", async () => {
  const req = new Request("https://pioneer.test/api/post-exam-applications", {
    method: "POST",
    body: "{",
  });
  assert.equal((await submitPostExam(req, options)).status, 400);
});
test("oversized payload rejected before processing", async () =>
  assert.equal(
    (
      await submitPostExam(
        request({ ...valid, name: "x".repeat(5000) }),
        options,
      )
    ).status,
    413,
  ));
test("server validates independently from browser", async () =>
  assert.equal(
    (await submitPostExam(request({ ...valid, agree: false }), options)).status,
    400,
  ));
test("missing configuration fails without a fake success", async () =>
  assert.equal(
    (await submitPostExam(request(), { now: RECRUITMENT_START })).status,
    503,
  ));
test("untrusted script URL is not requested", async () =>
  assert.equal(
    (
      await submitPostExam(request(), {
        ...options,
        scriptUrl: "http://other.test",
        fetchImpl: () => assert.fail("must not send"),
      })
    ).status,
    502,
  ));
test("confirmed upstream success forwards normalized compatible sheet fields", async () => {
  let calls = 0;
  const response = await submitPostExam(request(), {
    ...options,
    fetchImpl: async (url, init) => {
      calls++;
      assert.equal(url.hostname, "script.google.com");
      const data = JSON.parse(init.body);
      assert.equal(data.source, "event-page");
      assert.equal(data.campaign, "post-exam-v2");
      assert.equal(data.contact, "01012345678");
      assert.equal(data.referrer, "test_ref");
      assert.equal(data.words, "자유로운");
      assert.equal("agree" in data, false);
      return Response.json({ ok: true });
    },
  });
  assert.equal(calls, 1);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
});
for (const [label, fetchImpl] of [
  [
    "non-2xx response",
    async () => Response.json({ ok: true }, { status: 500 }),
  ],
  ["explicit rejection", async () => Response.json({ ok: false })],
  ["unconfirmed result", async () => Response.json({ saved: true })],
  ["HTML response", async () => new Response("<html>login</html>")],
  [
    "network failure",
    async () => {
      throw new TypeError("network");
    },
  ],
  [
    "timeout",
    async () => {
      throw new DOMException("timeout", "TimeoutError");
    },
  ],
])
  test(`${label} never reports success`, async () => {
    const response = await submitPostExam(request(), { ...options, fetchImpl });
    assert.equal(response.status, 502);
    assert.equal((await response.json()).ok, false);
  });
