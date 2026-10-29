import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { readSession, writeSession, clearSession } from "@/lib/session";
import { backend, resultRow, row, normalizeTransaction } from "@/lib/backend";
import {
  getProfile,
  getRecipients,
  getRecipient,
  getActivity,
  getTransaction,
} from "@/lib/data";
import {
  createDemo,
  deleteDemo,
  demoAccount,
  demoTransfer,
  demoTopup,
  verifyDemoPin,
  changeDemoPin,
  changeDemoPassword,
} from "@/lib/demo";
import {
  AppError,
  amountValue,
  textValue,
  pinValue,
  passwordValue,
  emailValue,
} from "@/lib/validation";
export const runtime = "nodejs";
const state = globalThis as typeof globalThis & {
  rewalletLimits?: Map<string, { count: number; until: number }>;
};
const limits = (state.rewalletLimits ??= new Map());
function limit(key: string) {
  const now = Date.now();
  for (const [k, entry] of limits) if (entry.until < now) limits.delete(k);
  const item = limits.get(key) ?? { count: 0, until: now + 60_000 };
  if (++item.count > 20)
    throw new AppError("Terlalu banyak permintaan. Tunggu sebentar.", 429);
  limits.set(key, item);
}
function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
async function readLimited(request: Request, maximum: number) {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maximum) {
      await reader.cancel();
      throw new AppError("Permintaan terlalu besar.", 413);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}
async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const parts = (await context.params).path;
    const path = parts.join("/");
    let session = await readSession();
    let body: Record<string, unknown> = {};
    if (request.method !== "GET") {
      if (
        request.headers.get("origin") !== request.nextUrl.origin ||
        request.headers.get("sec-fetch-site") === "cross-site"
      )
        throw new AppError("Asal permintaan tidak diizinkan.", 403);
      limit(session?.id ?? "guest");
      if (path !== "profile/picture") {
        if (!request.headers.get("content-type")?.includes("application/json"))
          throw new AppError("Format permintaan tidak didukung.", 415);
        const raw = new TextDecoder().decode(
          await readLimited(request, 16_384),
        );
        try {
          body = row(JSON.parse(raw));
        } catch {
          throw new AppError("Format permintaan tidak valid.");
        }
      }
    }
    if (path === "auth/demo" && request.method === "POST") {
      if (
        process.env.NODE_ENV === "production" &&
        process.env.DEMO_ENABLED !== "true"
      )
        throw new AppError("Demo tidak tersedia di lingkungan ini.", 403);
      if (session?.mode === "demo") deleteDemo(session.id);
      session = {
        id: createDemo(),
        mode: "demo",
        hasPin: true,
        expires: Date.now() + 28_800_000,
      };
      await writeSession(session);
      return json({ returnTo: "/dashboard" });
    }
    if (path === "auth/login" && request.method === "POST") {
      const data = await backend("/auth/login", null, "POST", {
        email: emailValue(body.email),
        password: passwordValue(body.password),
      });
      const result = resultRow(data);
      if (typeof result.token !== "string" || !result.token)
        throw new AppError("Respons masuk tidak valid.", 502);
      session = {
        mode: "live",
        id: String(result.user_id ?? result.id ?? randomUUID()),
        token: result.token,
        hasPin:
          typeof result.hasPin === "boolean"
            ? result.hasPin
            : Boolean(result.pin),
        expires: Date.now() + 28_800_000,
      };
      const profile = await getProfile(session);
      session.id = profile.id;
      session.hasPin = profile.hasPin;
      await writeSession(session);
      return json({ hasPin: session.hasPin });
    }
    if (path === "auth/register" && request.method === "POST") {
      await backend("/auth/register", null, "POST", {
        username: textValue(body.username, "Username", 4, 32),
        email: emailValue(body.email),
        password: passwordValue(body.password),
      });
      return json({ message: "Akun berhasil dibuat. Silakan masuk." });
    }
    if (path === "auth/recovery" && request.method === "POST") {
      const email = emailValue(body.email);
      if (!process.env.BACKEND_RECOVERY_PATH)
        throw new AppError(
          "Pemulihan melalui tautan email belum tersedia dari layanan.",
          501,
        );
      try {
        await backend(process.env.BACKEND_RECOVERY_PATH, null, "POST", {
          email,
        });
      } catch (error) {
        if (!(error instanceof AppError) || error.status >= 500) throw error;
      }
      return json({
        message:
          "Jika email terdaftar, tautan pemulihan akan dikirim. Periksa kotak masuk dan folder spam.",
      });
    }
    if (path === "auth/reset" && request.method === "POST") {
      if (!process.env.BACKEND_RESET_PATH)
        throw new AppError(
          "Pemulihan password belum tersedia dari layanan.",
          501,
        );
      await backend(process.env.BACKEND_RESET_PATH, null, "POST", {
        token: textValue(body.token, "Token", 16, 1024),
        password: passwordValue(body.password),
      });
      return json({ message: "Password diperbarui. Silakan masuk." });
    }
    if (path === "auth/logout" && request.method === "POST") {
      if (session?.mode === "demo") deleteDemo(session.id);
      await clearSession();
      return json({ ok: true });
    }
    if (!session) throw new AppError("Silakan masuk kembali.", 401);
    if (path === "onboarding/pin" && request.method === "POST") {
      if (session.hasPin)
        throw new AppError(
          "PIN sudah dibuat. Gunakan pengaturan ganti PIN.",
          409,
        );
      const pin = pinValue(body.pin);
      if (session.mode === "demo") changeDemoPin(session.id, pin);
      else {
        const profile = await getProfile(session);
        await backend("/auth/createPin", session, "POST", {
          pin,
          email: profile.email,
        });
      }
      session.hasPin = true;
      await writeSession(session);
      return json({ ok: true });
    }
    if (!session.hasPin)
      throw new AppError("Buat PIN sebelum melanjutkan.", 403, "ONBOARDING");
    if (request.method === "GET") {
      const page = Math.max(
        1,
        Math.min(10_000, Number(request.nextUrl.searchParams.get("page")) || 1),
      );
      if (path === "profile") return json(await getProfile(session));
      if (path === "recipients")
        return json(
          await getRecipients(
            session,
            (request.nextUrl.searchParams.get("search") ?? "").slice(0, 100),
            page,
          ),
        );
      if (parts[0] === "recipients" && parts.length === 2)
        return json(await getRecipient(session, parts[1]));
      if (path === "activity") return json(await getActivity(session, page));
      if (parts[0] === "transactions" && parts.length === 2)
        return json(await getTransaction(session, parts[1]));
    }
    if (path === "transfer" && request.method === "POST") {
      const recipientId = textValue(body.recipientId, "Penerima", 1, 100);
      const pin = pinValue(body.pin),
        notes = textValue(body.notes ?? "", "Catatan", 0, 100);
      const key = textValue(body.key, "ID permintaan", 16, 100);
      if (session.mode === "demo")
        return json(
          await demoTransfer(
            session.id,
            recipientId,
            body.amount,
            pin,
            notes,
            key,
          ),
        );
      if (
        process.env.BACKEND_TRANSFER_SUPPORTS_PIN !== "true" ||
        !process.env.BACKEND_TRANSACTION_PATH
      )
        throw new AppError(
          "Transfer menunggu dukungan verifikasi PIN, idempotensi, dan detail transaksi dari layanan.",
          501,
        );
      const profile = await getProfile(session);
      const amount = amountValue(body.amount, profile.balance);
      await getRecipient(session, recipientId);
      const data = await backend(
        "/transfer",
        session,
        "POST",
        { recipient_id: recipientId, amount, notes, pin, type_id: 1 },
        { "Idempotency-Key": key },
      );
      const transaction = normalizeTransaction(resultRow(data), session.id);
      if (!transaction.id)
        throw new AppError(
          "Respons belum memuat ID transaksi. Periksa Aktivitas sebelum mengirim kembali.",
          502,
          "UNCERTAIN",
        );
      return json(transaction);
    }
    if (path === "topup" && request.method === "POST") {
      const amount = amountValue(body.amount),
        key = textValue(body.key, "ID permintaan", 16, 100);
      if (session.mode === "demo")
        return json(demoTopup(session.id, amount, key));
      if (!process.env.BACKEND_TRANSACTION_PATH)
        throw new AppError(
          "Isi saldo menunggu dukungan status transaksi dari layanan.",
          501,
        );
      const data = await backend(
        "/topup",
        session,
        "POST",
        { amount },
        { "Idempotency-Key": key },
      );
      const transaction = normalizeTransaction(resultRow(data), session.id);
      if (!transaction.id)
        throw new AppError(
          "Status isi saldo belum pasti. Periksa Aktivitas sebelum mencoba kembali.",
          502,
          "UNCERTAIN",
        );
      return json(transaction);
    }
    if (path === "profile" && request.method === "PATCH") {
      const name = textValue(body.name, "Nama lengkap", 2, 80);
      if (session.mode === "demo") demoAccount(session.id).profile.name = name;
      else await backend("/profile/", session, "PATCH", { fullname: name });
      return json(await getProfile(session));
    }
    if (path === "profile/phone" && request.method === "PATCH") {
      const phone = textValue(body.phone, "Nomor telepon", 10, 16);
      if (!/^(\+62|08|62)\d{8,13}$/.test(phone))
        throw new AppError("Masukkan nomor Indonesia yang valid, tanpa spasi.");
      if (session.mode === "demo")
        demoAccount(session.id).profile.phone = phone;
      else
        await backend("/profile/", session, "PATCH", { phone_number: phone });
      return json({ message: "Nomor telepon berhasil diperbarui." });
    }
    if (path === "profile/password" && request.method === "PATCH") {
      const current = passwordValue(body.current),
        next = passwordValue(body.next);
      if (current === next) throw new AppError("Password baru harus berbeda.");
      if (session.mode === "demo")
        changeDemoPassword(session.id, current, next);
      else
        await backend("/changePassword", session, "PATCH", {
          password: current,
          newpassword: next,
        });
      return json({ message: "Password berhasil diperbarui." });
    }
    if (path === "profile/pin" && request.method === "PATCH") {
      const current = pinValue(body.current),
        next = pinValue(body.next);
      if (current === next) throw new AppError("PIN baru harus berbeda.");
      if (session.mode === "demo") {
        verifyDemoPin(session.id, current);
        changeDemoPin(session.id, next);
      } else {
        if (!process.env.BACKEND_CHANGE_PIN_PATH)
          throw new AppError("Ganti PIN belum didukung layanan.", 501);
        await backend(process.env.BACKEND_CHANGE_PIN_PATH, session, "PATCH", {
          pin: current,
          newpin: next,
        });
      }
      return json({ message: "PIN berhasil diperbarui." });
    }
    if (path === "profile/picture" && request.method === "POST") {
      if (Number(request.headers.get("content-length")) > 2_200_000)
        throw new AppError("Ukuran foto maksimal 2 MB.", 413);
      const bytesReceived = await readLimited(request, 2_200_000);
      const form = await new Response(bytesReceived, {
          headers: {
            "Content-Type": request.headers.get("content-type") ?? "",
          },
        }).formData(),
        file = form.get("picture");
      if (
        !(file instanceof File) ||
        file.size > 2_000_000 ||
        !["image/jpeg", "image/png", "image/webp"].includes(file.type)
      )
        throw new AppError("Pilih foto JPG, PNG, atau WebP maksimal 2 MB.");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const valid =
        file.type === "image/jpeg"
          ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
          : file.type === "image/png"
            ? bytes[0] === 137 &&
              bytes[1] === 80 &&
              bytes[2] === 78 &&
              bytes[3] === 71
            : Buffer.from(bytes.slice(0, 4)).toString() === "RIFF" &&
              Buffer.from(bytes.slice(8, 12)).toString() === "WEBP";
      if (!valid) throw new AppError("Isi file tidak sesuai format gambar.");
      if (session.mode === "demo")
        demoAccount(session.id).profile.picture =
          `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;
      else {
        const upload = new FormData();
        upload.set("picture", file);
        await backend("/profile/", session, "PATCH", upload);
      }
      return json({ message: "Foto profil berhasil diperbarui." });
    }
    throw new AppError("Halaman layanan tidak ditemukan.", 404);
  } catch (error) {
    if (error instanceof AppError) {
      if (error.status === 401) await clearSession();
      return json({ message: error.message, code: error.code }, error.status);
    }
    return json(
      { message: "Permintaan belum dapat diproses. Coba kembali nanti." },
      500,
    );
  }
}
export { handler as GET, handler as POST, handler as PATCH };
