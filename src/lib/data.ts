import "server-only";
import type { Session, Recipient } from "./types";
import {
  backend,
  normalizeProfile,
  normalizeRecipient,
  normalizeTransaction,
  normalizeList,
  resultRow,
} from "./backend";
import { demoAccount, demoRecipients } from "./demo";
import { AppError, idValue } from "./validation";
export async function getProfile(session: Session) {
  return session.mode === "demo"
    ? demoAccount(session.id).profile
    : normalizeProfile(await backend("/profile", session), session);
}
export async function getRecipients(session: Session, search = "", page = 1) {
  if (session.mode === "demo")
    return {
      items: demoRecipients.filter((p) =>
        (p.name + p.phone).toLowerCase().includes(search.toLowerCase()),
      ),
      pageInfo: { page: 1, totalPages: 1 },
    };
  return normalizeList(
    await backend(
      `/allProfile?${new URLSearchParams({ search, page: String(page), limit: "8" })}`,
      session,
    ),
    normalizeRecipient,
    page,
  );
}
export async function getRecipient(
  session: Session,
  id: string,
): Promise<Recipient> {
  idValue(id);
  if (session.mode === "demo") {
    const p = demoRecipients.find((p) => p.id === id);
    if (!p) throw new AppError("Penerima tidak ditemukan.", 404);
    return p;
  }
  // Preserve the existing lookup contract, with the session token and no admin data exposed.
  const p = normalizeRecipient(
    resultRow(
      await backend(`/admin/profile/${encodeURIComponent(id)}`, session),
    ),
  );
  if (!p.id || p.id !== id || p.id === session.id)
    throw new AppError("Penerima tidak tersedia.", 404);
  return p;
}
export async function getActivity(session: Session, page = 1) {
  if (session.mode === "demo") {
    const items = demoAccount(session.id).transactions;
    return {
      items: items.slice((page - 1) * 8, page * 8),
      pageInfo: { page, totalPages: Math.max(1, Math.ceil(items.length / 8)) },
    };
  }
  return normalizeList(
    await backend(`/historyTransaction?limit=8&page=${page}`, session),
    (value) => normalizeTransaction(value, session.id),
    page,
  );
}
export async function getTransaction(session: Session, id: string) {
  idValue(id);
  if (session.mode === "demo") {
    const transaction = demoAccount(session.id).transactions.find(
      (t) => t.id === id,
    );
    if (!transaction) throw new AppError("Transaksi tidak ditemukan.", 404);
    return transaction;
  }
  if (!process.env.BACKEND_TRANSACTION_PATH)
    throw new AppError(
      "Detail transaksi belum didukung layanan. Periksa daftar Aktivitas.",
      501,
    );
  // Backend must authorize the ID for this user; never fetch unauthenticated transaction data.
  const transaction = normalizeTransaction(
    resultRow(
      await backend(
        `${process.env.BACKEND_TRANSACTION_PATH}/${encodeURIComponent(id)}`,
        session,
      ),
    ),
    session.id,
  );
  if (transaction.id !== id)
    throw new AppError("Transaksi tidak ditemukan.", 404);
  return transaction;
}
