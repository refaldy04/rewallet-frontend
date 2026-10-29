import { test, expect } from "@playwright/test";
test("landing mempertahankan seluruh section dan tidak overflow", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Uangmu teratur/ }),
  ).toBeVisible();
  for (const id of ["#tentang", "#fitur", "#cerita"])
    await expect(page.locator(id)).toBeAttached();
  await expect(
    page.getByRole("region", { name: "Logo ilustrasi" }),
  ).toBeVisible();
  await expect(page.locator("footer")).toContainText("contact@rewallet.com");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});
test("route privat, returnTo, alias lama, dan 404", async ({ page }) => {
  await page.goto("/transfer/nadia/amount");
  await expect(page).toHaveURL(/\/login\?returnTo=/);
  await page.goto("/change-password");
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fprofile%2Fpassword/);
  await page.goto("/halaman-yang-tidak-ada");
  await expect(
    page.getByRole("heading", { name: "Sepertinya kamu tersesat." }),
  ).toBeVisible();
});
test("demo: transfer, PIN salah, refresh draft, isi saldo, profil, logout", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/login");
  await page.getByRole("button", { name: "Coba akun demo" }).click();
  await expect(page).toHaveURL("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Halo, Bagas." }),
  ).toBeVisible();
  await expect(page.locator(".balance-value")).toContainText("4.250.000");
  const cookies = await context.cookies();
  const session = cookies.find((c) => c.name === "rewallet_session");
  expect(session?.httpOnly).toBeTruthy();
  expect(session?.sameSite).toBe("Lax");
  expect(await page.evaluate(() => document.cookie)).not.toContain(
    "rewallet_session",
  );
  await page.getByRole("button", { name: "Sembunyikan", exact: true }).click();
  await expect(page.locator(".balance-value")).toContainText("•••");
  await page.getByRole("button", { name: "Tampilkan", exact: true }).click();
  await page
    .locator(".balance-actions")
    .getByRole("link", { name: "Transfer", exact: true })
    .click();
  await page.getByLabel("Nama atau nomor telepon").fill("tidak-ada");
  await page.getByRole("button", { name: "Cari", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Penerima tidak ditemukan." }),
  ).toBeVisible();
  await page.getByLabel("Nama atau nomor telepon").fill("Nadia");
  await page.getByRole("button", { name: "Cari", exact: true }).click();
  await page.getByRole("link", { name: /Nadia Putri 0812/ }).click();
  await page.getByLabel(/^Nominal transfer \(Rp\)/).fill("150000");
  await page
    .getByLabel("Catatan (opsional)", { exact: true })
    .fill("Makan siang dari tes");
  await page.getByRole("button", { name: "Periksa transfer" }).click();
  await expect(
    page.getByText("Makan siang dari tes", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Makan siang dari tes", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Lanjutkan dengan PIN" }).click();
  await page.getByLabel(/^PIN transfer/).fill("000000");
  await page.getByRole("button", { name: "Kirim simulasi" }).click();
  await expect(
    page.getByText("PIN tidak sesuai. Periksa kembali PIN kamu."),
  ).toBeVisible();
  await page.getByLabel(/^PIN transfer/).fill("123456");
  await page.getByRole("button", { name: "Kirim simulasi" }).click();
  await expect(
    page.getByRole("heading", { name: "Simulasi berhasil." }),
  ).toBeVisible();
  await expect(
    page.getByText("Makan siang dari tes", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Simulasi berhasil." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Kembali ke ringkasan" }).click();
  await expect(page.locator(".balance-value")).toContainText("4.100.000");
  await page
    .locator(".balance-actions")
    .getByRole("link", { name: "Isi saldo" })
    .click();
  await page.getByLabel(/^Nominal isi saldo \(Rp\)/).fill("100000");
  await page.getByRole("button", { name: "Simulasikan isi saldo" }).click();
  await expect(
    page.getByRole("heading", { name: "Simulasi berhasil." }),
  ).toBeVisible();
  await page.goto("/dashboard");
  await expect(page.locator(".balance-value")).toContainText("4.200.000");
  await page.goto("/profile/personal");
  await page.getByLabel(/^Nama lengkap/).fill("Bagas Baru");
  await page.getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(
    page.getByText("Informasi personal berhasil diperbarui."),
  ).toBeVisible();
  await page.goto("/profile/phone");
  await page.getByLabel("Nomor telepon baru").fill("081234567899");
  await page.getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(
    page.getByText("Nomor telepon berhasil diperbarui."),
  ).toBeVisible();
  await page.goto("/profile/pin");
  await page.getByLabel(/^PIN saat ini/).fill("123456");
  await page.getByLabel(/^PIN baru/).fill("654321");
  await page.getByLabel(/^Konfirmasi PIN baru/).fill("654321");
  await page.getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(page.getByText("PIN berhasil diperbarui.")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.goto("/profile");
  await page.getByRole("button", { name: "Keluar dari akun" }).click();
  await page.getByRole("button", { name: "Keluar", exact: true }).click();
  await expect(page).toHaveURL("/login");
  expect(errors).toEqual([]);
});
test("API menolak CSRF dan tidak membocorkan PIN/token", async ({ page }) => {
  await page.goto("/login");
  const forbidden = await page.request.post("/api/wallet/auth/demo", {
    data: {},
    headers: { Origin: "https://evil.example" },
  });
  expect(forbidden.status()).toBe(403);
  await page.getByRole("button", { name: "Coba akun demo" }).click();
  await expect(page).toHaveURL("/dashboard");
  const profile = await page.request.get("/api/wallet/profile");
  expect(profile.ok()).toBeTruthy();
  const data = await profile.json();
  expect(data).not.toHaveProperty("pin");
  expect(data).not.toHaveProperty("token");
  expect(data).not.toHaveProperty("pinHash");
  const id = crypto.randomUUID();
  const post = () =>
    page.request.post("/api/wallet/transfer", {
      headers: { Origin: "http://localhost:3100" },
      data: {
        recipientId: "nadia",
        amount: 100000,
        pin: "123456",
        notes: "Idempoten",
        key: id,
      },
    });
  const first = await post(),
    second = await post();
  expect(first.ok()).toBeTruthy();
  expect((await first.json()).id).toBe((await second.json()).id);
  expect(
    (await (await page.request.get("/api/wallet/profile")).json()).balance,
  ).toBe(4150000);
  const oversized = await page.request.post("/api/wallet/transfer", {
    headers: { Origin: "http://localhost:3100" },
    data: { notes: "a".repeat(17000) },
  });
  expect(oversized.status()).toBe(413);
  const fakeImage = await page.request.post("/api/wallet/profile/picture", {
    headers: { Origin: "http://localhost:3100" },
    multipart: {
      picture: {
        name: "fake.png",
        mimeType: "image/png",
        buffer: Buffer.from("not an image"),
      },
    },
  });
  expect(fakeImage.status()).toBe(400);
  const picture = await page.request.post("/api/wallet/profile/picture", {
    headers: { Origin: "http://localhost:3100" },
    multipart: {
      picture: {
        name: "avatar.png",
        mimeType: "image/png",
        buffer: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aY+8AAAAASUVORK5CYII=",
          "base64",
        ),
      },
    },
  });
  expect(picture.ok()).toBeTruthy();
  expect(
    (await (await page.request.get("/api/wallet/profile")).json()).picture,
  ).toMatch(/^data:image\/png;base64,/);
});
