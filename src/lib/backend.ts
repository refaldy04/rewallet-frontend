import "server-only";
import type {
  Profile,
  Recipient,
  Transaction,
  Session,
  PageInfo,
} from "./types";
import { AppError } from "./validation";
type Row = Record<string, unknown>;
export function row(value: unknown): Row {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Row)
    : {};
}
export function resultRow(value: unknown) {
  const r = row(value).result ?? value;
  return row(Array.isArray(r) ? r[0] : r);
}
const str = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
export async function backend(
  path: string,
  session?: Session | null,
  method = "GET",
  body?: Record<string, unknown> | FormData,
  headers: Record<string, string> = {},
) {
  const base = process.env.BACKEND_URL;
  if (!base)
    throw new AppError(
      "Layanan belum terhubung. Kamu dapat mencoba akun demo.",
      503,
    );
  const url = new URL(base.replace(/\/$/, "") + "/" + path.replace(/^\//, ""));
  if (!["https:", "http:"].includes(url.protocol))
    throw new AppError("Konfigurasi layanan tidak valid.", 503);
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;
  let payload: BodyInit | undefined;
  if (body instanceof FormData) payload = body;
  else if (body) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    payload = new URLSearchParams(
      Object.entries(body).map(([k, v]) => [k, String(v)]),
    ).toString();
  }
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      body: payload,
      headers,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new AppError(
      method === "GET"
        ? "Layanan tidak merespons. Coba muat ulang."
        : "Respons belum diterima. Periksa Aktivitas sebelum mencoba kembali.",
      504,
      method === "GET" ? "UNAVAILABLE" : "UNCERTAIN",
    );
  }
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new AppError(
      method === "GET"
        ? "Respons layanan tidak valid."
        : "Respons belum dapat dipastikan. Periksa Aktivitas sebelum mencoba kembali.",
      502,
      method === "GET" ? "API_ERROR" : "UNCERTAIN",
    );
  }
  if (
    !response.ok ||
    row(data).success === false ||
    row(data).status === false
  ) {
    const status = response.ok ? 400 : response.status;
    if (method !== "GET" && status >= 500)
      throw new AppError(
        "Layanan belum mengonfirmasi hasil. Periksa Aktivitas sebelum mencoba kembali.",
        status,
        "UNCERTAIN",
      );
    throw new AppError(
      status === 401
        ? "Sesi berakhir. Silakan masuk kembali."
        : status === 403
          ? "Akses tidak diizinkan."
          : status === 404
            ? "Data tidak ditemukan."
            : status >= 500
              ? "Layanan sedang mengalami gangguan."
              : "Permintaan ditolak. Periksa isian lalu coba kembali.",
      status,
      status === 401 ? "UNAUTHORIZED" : "API_ERROR",
    );
  }
  return data as unknown;
}
export function normalizeProfile(data: unknown, session: Session): Profile {
  const p = resultRow(data);
  const n = Number(p.balance);
  return {
    id: str(p.user_id ?? p.id, session.id),
    name: str(p.fullname ?? p.full_name ?? p.name, "Pengguna Rewallet"),
    username: str(p.username),
    email: str(p.email),
    phone: str(p.phone_number ?? p.phone),
    balance: p.balance != null && Number.isFinite(n) ? n : null,
    hasPin: typeof p.hasPin === "boolean" ? p.hasPin : session.hasPin,
    picture:
      typeof p.picture === "string" && p.picture.startsWith("https://")
        ? p.picture
        : undefined,
  };
}
export function normalizeRecipient(value: unknown): Recipient {
  const p = row(value);
  return {
    id: str(p.user_id ?? p.id),
    name: str(p.fullname ?? p.name ?? p.username, "Pengguna Rewallet"),
    phone: str(p.phone_number ?? p.phone, "Nomor belum tersedia"),
  };
}
export function normalizeTransaction(
  value: unknown,
  userId: string,
): Transaction {
  const t = row(value);
  const amount = Number(t.amount);
  const id = str(t.transaction_id ?? t.id);
  if (!id || t.amount == null || !Number.isSafeInteger(amount) || amount < 0)
    throw new AppError(
      "Detail transaksi dari layanan belum lengkap.",
      502,
      "UNCERTAIN",
    );
  const kind =
    t.kind === "topup" || Number(t.type_id) === 2 ? "topup" : "transfer";
  const sender = str(t.sender_id ?? t.senderId),
    recipient = str(t.recipient_id ?? t.recipientId);
  const direction =
    kind === "topup"
      ? "in"
      : sender === userId
        ? "out"
        : recipient === userId
          ? "in"
          : t.direction === "in" || t.direction === "out"
            ? t.direction
            : "unknown";
  const rawStatus = str(t.status).toLowerCase();
  const status = ["success", "completed", "berhasil"].includes(rawStatus)
    ? "success"
    : ["failed", "rejected", "gagal"].includes(rawStatus)
      ? "failed"
      : "pending";
  return {
    id,
    name: str(
      t.fullname ?? t.name,
      kind === "topup" ? "Isi saldo" : "Transfer",
    ),
    amount,
    direction,
    kind,
    status,
    date: str(t.created_at ?? t.time ?? t.date),
    notes: str(t.notes),
  };
}
export function normalizeList<T>(
  data: unknown,
  mapper: (value: unknown) => T,
  page: number,
): { items: T[]; pageInfo: PageInfo } {
  const d = row(data),
    info = row(d.pageInfo);
  const items = Array.isArray(d.result) ? d.result.map(mapper) : [];
  return {
    items,
    pageInfo: {
      page,
      totalPages: Math.max(
        page,
        Number(info.totalPages ?? info.totalPage) || 1,
      ),
    },
  };
}
