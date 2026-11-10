import { test, expect, type Page } from "@playwright/test";

async function login(page: Page, scenario = "paid") {
  const email = `${scenario}-${crypto.randomUUID()}@example.test`;
  await page.goto("/login");
  await page.getByLabel(/^Alamat email/).fill(email);
  await page.getByLabel(/^Password/).fill("Testing123!");
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await expect(page).toHaveURL("/dashboard");
  await page.goto("/top-up");
  return email;
}

async function selectMethod(page: Page, name: string) {
  await page.getByRole("combobox", { name: "Metode pembayaran" }).click();
  await page.getByRole("option", { name, exact: true }).click();
}

test("live: polling GET membaca konfirmasi tanpa memanggil rekonsiliasi otomatis", async ({
  page,
  request,
}) => {
  const email = await login(page, "poll");
  await page.getByRole("button", { name: "Lanjutkan isi saldo" }).click();
  await expect(page).toHaveURL(/topup_id=/);
  await expect(
    page.getByRole("heading", { name: "Menunggu konfirmasi pembayaran." }),
  ).toBeVisible();
  const id = new URL(page.url()).searchParams.get("topup_id")!;
  await request.post("http://127.0.0.1:3201/__test/capture", {
    headers: { Authorization: `Bearer test-${email}` },
    form: { id },
  });
  await expect(
    page.getByRole("heading", { name: "Isi saldo berhasil." }),
  ).toBeVisible();
  const entries = await (
    await request.get("http://127.0.0.1:3201/__test/intents", {
      headers: { Authorization: `Bearer test-${email}` },
    })
  ).json();
  expect(entries.result[0].refreshes).toBe(0);
});

test("live: katalog backend, QRIS, return, konfirmasi saldo dan aktivitas", async ({
  page,
}) => {
  await login(page);
  await expect(page.getByText(/maksimum Rp\s*10\.000\.000/)).toBeVisible();
  await selectMethod(page, "QRIS");
  await page.getByLabel(/^Nominal isi saldo/).fill("6000000");
  await page.getByRole("button", { name: "Lanjutkan isi saldo" }).click();
  await expect(page).toHaveURL(/\/top-up\?topup_id=/);
  await expect(
    page.getByRole("heading", { name: "Menunggu konfirmasi pembayaran." }),
  ).toBeVisible();
  await expect(page.locator(".payment-qr svg")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Isi saldo berhasil." }),
  ).toHaveCount(0);
  const pending = await page.request.get("/api/wallet/profile");
  expect((await pending.json()).balance).toBe(0);
  await page.reload();
  await expect(page.locator(".payment-qr svg")).toBeVisible();
  await page.getByRole("button", { name: "Periksa status pembayaran" }).click();
  await expect(
    page.getByRole("heading", { name: "Isi saldo berhasil." }),
  ).toBeVisible();
  await expect(page.locator(".payment-qr svg")).toHaveCount(0);
  await expect
    .poll(
      async () =>
        (await (await page.request.get("/api/wallet/profile")).json()).balance,
    )
    .toBe(6000000);
  await page
    .getByRole("link", { name: "Lihat aktivitas", exact: true })
    .click();
  await expect(
    page.locator(".transaction-row").filter({ hasText: "Isi saldo" }),
  ).toContainText("Berhasil");
});

test("live: timeout dan reload memakai key serta payload sama, tanpa pembayaran ganda", async ({
  page,
  request,
}) => {
  const email = await login(page, "retry");
  await page.getByLabel(/^Nominal isi saldo/).fill("25000");
  await page.getByRole("button", { name: "Lanjutkan isi saldo" }).click();
  await expect(page.getByText(/Hasil permintaan belum diterima/)).toBeVisible();
  const saved = await page.evaluate(
    (email) => sessionStorage.getItem(`rewallet-topup:${email}`),
    email,
  );
  expect(JSON.parse(saved!).key).toBeTruthy();
  await page.reload();
  await expect(page.getByLabel(/^Nominal isi saldo/)).toBeDisabled();
  await page
    .getByRole("button", { name: "Periksa permintaan sebelumnya" })
    .click();
  await expect(page).toHaveURL(/topup_id=/);
  await expect(
    page.getByRole("link", { name: "Buka halaman pembayaran" }),
  ).toHaveAttribute("href", "https://checkout.example.test/pay");
  await expect(
    page.getByRole("link", { name: "Buka aplikasi pembayaran" }),
  ).toHaveAttribute("href", "dana://checkout/pay");
  const entries = await (
    await request.get("http://127.0.0.1:3201/__test/intents", {
      headers: { Authorization: `Bearer test-${email}` },
    })
  ).json();
  expect(entries.result).toHaveLength(1);
  expect(entries.result[0].key).toBe(JSON.parse(saved!).key);
  expect(entries.result[0].requests).toBe(2);
  expect(entries.result[0].body).toEqual({
    amount: "25000",
    channel_code: "DANA",
  });
  const id = new URL(page.url()).searchParams.get("topup_id");
  await page.goto("/top-up");
  await expect(page).toHaveURL(new RegExp(`topup_id=${id}`));
});

for (const scenario of ["failed", "expired"])
  test(`live: ${scenario} menyembunyikan aksi pembayaran dan tidak menambah saldo`, async ({
    page,
  }) => {
    await login(page, scenario);
    await page.getByRole("button", { name: "Lanjutkan isi saldo" }).click();
    await expect(
      page.getByRole("link", { name: "Buka halaman pembayaran" }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Periksa status pembayaran" })
      .click();
    await expect(
      page.getByRole("heading", {
        name:
          scenario === "failed"
            ? "Pembayaran tidak berhasil."
            : "Pembayaran kedaluwarsa.",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Buka halaman pembayaran" }),
    ).toHaveCount(0);
    expect(
      (await (await page.request.get("/api/wallet/profile")).json()).balance,
    ).toBe(0);
    await page.getByRole("link", { name: "Kembali ke isi saldo" }).click();
    await expect(
      page.getByRole("button", { name: "Lanjutkan isi saldo" }),
    ).toBeVisible();
  });

test("live: UNKNOWN dan status SUCCEEDED tanpa transaksi belum ditampilkan berhasil", async ({
  page,
}) => {
  await login(page, "unknown");
  await page.getByRole("button", { name: "Lanjutkan isi saldo" }).click();
  await expect(page.getByText(/Permintaan masih diperiksa/)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Isi saldo berhasil." }),
  ).toHaveCount(0);
  await page.context().clearCookies();
  await login(page, "unlinked");
  await page.getByRole("button", { name: "Lanjutkan isi saldo" }).click();
  await expect(
    page.getByRole("link", { name: "Buka halaman pembayaran" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Periksa status pembayaran" }).click();
  await expect(
    page.getByRole("heading", { name: "Menunggu konfirmasi pembayaran." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Buka halaman pembayaran" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Isi saldo berhasil." }),
  ).toHaveCount(0);
});

test("live: return page dan akses API tidak mengonfirmasi pembayaran atau membuka milik pengguna lain", async ({
  page,
  browser,
}) => {
  await login(page);
  await page.getByRole("button", { name: "Lanjutkan isi saldo" }).click();
  await expect(page).toHaveURL(/topup_id=/);
  const id = new URL(page.url()).searchParams.get("topup_id");
  await page.goto(`/top-up?topup_id=${id}&status=success`);
  await expect(
    page.getByRole("heading", { name: "Menunggu konfirmasi pembayaran." }),
  ).toBeVisible();
  const other = await browser.newContext({ baseURL: "http://localhost:3100" });
  try {
    const otherPage = await other.newPage();
    await login(otherPage);
    expect((await other.request.get(`/api/wallet/topups/${id}`)).status()).toBe(
      404,
    );
    expect(
      (
        await other.request.post(`/api/wallet/topups/${id}/refresh`, {
          data: {},
          headers: { Origin: "https://evil.example" },
        })
      ).status(),
    ).toBe(403);
  } finally {
    await other.close();
  }
});
