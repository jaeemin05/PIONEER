// Requires platform Playwright + Chromium; no application dependency changes.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.BASE_URL || "http://127.0.0.1:3002";
(async () => {
  const proxy = process.env.HTTPS_PROXY;
  const browser = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
    ...(proxy
      ? { proxy: { server: proxy, bypass: "127.0.0.1,localhost" } }
      : {}),
  });
  const pageErrors = [];
  try {
    for (const width of [320, 390, 768, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 844 },
        isMobile: width < 768,
        hasTouch: width < 768,
      });
      const page = await context.newPage();
      page.on("pageerror", (err) => pageErrors.push(err.message));
      await page.clock.install({ time: new Date("2026-10-27T12:00:00+09:00") });
      assert.equal(
        (
          await page.goto(base + "/event/v2?ref=mobile_test", {
            waitUntil: "networkidle",
          })
        ).status(),
        200,
      );
      await page
        .getByRole("button", { name: "미리 작성", exact: true })
        .waitFor();
      assert.ok(await page.getByRole("heading", { level: 1 }).isVisible());
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `overflow at ${width}`,
      );
      const body = await page.locator("body").innerText();
      for (const forbidden of ["배송비", "선착순", "30명", "마감일"])
        assert.equal(body.includes(forbidden), false, forbidden);
      if (width === 390 || width === 1440)
        await page.screenshot({
          path: `/workspace/.pioneer-onboarding/v2-${width}.png`,
          fullPage: true,
        });
      const trigger = page.getByRole("button", {
        name: "미리 작성",
        exact: true,
      });
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await dialog.waitFor();
      assert.equal(
        await dialog
          .getByRole("button", { name: "10월 29일에 신청할 수 있어요" })
          .isDisabled(),
        true,
      );
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "detached" });
      assert.equal(
        await trigger.evaluate((el) => el === document.activeElement),
        true,
      );
      console.log(
        `PASS ${width}px: layout, campaign copy, pre-opening gate, modal and restored focus`,
      );
      await context.close();
    }
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    page.on("pageerror", (err) => pageErrors.push(err.message));
    await page.clock.install({ time: new Date("2026-10-29T10:00:00+09:00") });
    await page.goto(base + "/event/v2?ref=mobile_test", {
      waitUntil: "networkidle",
    });
    await page.getByRole("button", { name: "신청하기", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByRole("button", { name: "무료 제작 신청하기 ↗", exact: true })
      .click();
    assert.equal(await dialog.locator("[aria-invalid=true]").count(), 5);
    assert.equal(
      await page.evaluate(() => document.activeElement.id),
      "v2-name",
    );
    await page.getByLabel("이름 필수", { exact: true }).fill("신청 테스트");
    await page
      .getByLabel("휴대폰 번호 필수", { exact: true })
      .fill("010-1234-5678");
    await page
      .getByLabel("참여 지역 필수", { exact: true })
      .selectOption("경기남부");
    await page.getByRole("button", { name: "자유로운", exact: true }).click();
    await page.getByLabel("수험생 대상 이벤트임을 확인했어요. (필수)").check();
    await page.getByLabel("개인정보 수집·이용에 동의해요. (필수)").check();
    await page.getByText("개인정보 수집·이용 안내", { exact: true }).click();
    assert.ok(
      await page
        .getByText("목적: 이벤트 신청 확인 및 참여 안내", { exact: false })
        .isVisible(),
    );
    let calls = 0;
    await page.route("**/api/post-exam-applications", async (route) => {
      calls++;
      const data = route.request().postDataJSON();
      assert.equal(data.referrer, "mobile_test");
      assert.equal(data.region, "경기남부");
      assert.deepEqual(data.words, ["자유로운"]);
      await new Promise((resolve) => setTimeout(resolve, 250));
      await route.fulfill({
        status: calls === 1 ? 502 : 200,
        contentType: "application/json",
        body: JSON.stringify(
          calls === 1
            ? { ok: false, error: "접수를 확인하지 못했어요." }
            : { ok: true },
        ),
      });
    });
    const submit = dialog.getByRole("button", {
      name: "무료 제작 신청하기 ↗",
      exact: true,
    });
    await submit.click();
    await dialog.getByRole("alert").waitFor();
    assert.equal(
      await page.getByLabel("이름 필수", { exact: true }).inputValue(),
      "신청 테스트",
    );
    assert.equal(
      await page.getByRole("heading", { name: "신청이 접수됐어요." }).count(),
      0,
    );
    await submit.click();
    await page.getByRole("heading", { name: "신청이 접수됐어요." }).waitFor();
    assert.equal(calls, 2);
    await page.screenshot({
      path: "/workspace/.pioneer-onboarding/v2-success.png",
    });
    await dialog.getByRole("button", { name: "확인", exact: true }).click();
    assert.equal(await page.evaluate(() => document.body.style.overflow), "");
    assert.deepEqual(pageErrors, []);
    for (const path of ["/", "/event", "/admin"])
      assert.equal((await page.request.get(base + path)).status(), 200);
    const real = await page.request.post(base + "/api/post-exam-applications", {
      data: {},
    });
    assert.ok([400, 403].includes(real.status()));
    console.log(
      "PASS mobile: validation, keyword selection, consent, referral, failure preserves input, retry, confirmed success, existing routes; no JS errors. Success uses intercepted API; no live application sent.",
    );
    await context.close();
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
