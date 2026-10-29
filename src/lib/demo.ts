import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import type { Profile, Recipient, Transaction } from "./types";
import { AppError, amountValue, pinValue } from "./validation";
export const demoRecipients: Recipient[] = [
  { id: "nadia", name: "Nadia Putri", phone: "0812 1234 2408" },
  { id: "arif", name: "Arif Rahman", phone: "0857 1234 9152" },
  { id: "dinda", name: "Dinda Ayu", phone: "0813 1234 6007" },
  { id: "fajar", name: "Fajar Pratama", phone: "0821 1234 3810" },
];
type DemoAccount = {
  profile: Profile;
  transactions: Transaction[];
  salt: string;
  pinHash: Buffer;
  passwordHash: Buffer;
  attempts: number;
  lockedUntil: number;
  expires: number;
  requests: Map<string, { id: string; fingerprint: string }>;
};
const runtime = globalThis as typeof globalThis & {
  rewalletDemo?: Map<string, DemoAccount>;
};
const accounts = (runtime.rewalletDemo ??= new Map<string, DemoAccount>());
export function createDemo() {
  for (const [id, account] of accounts)
    if (account.expires < Date.now()) accounts.delete(id);
  if (accounts.size >= 500)
    throw new AppError("Demo sedang penuh. Coba lagi nanti.", 429);
  const id = randomUUID(),
    salt = randomBytes(16).toString("hex");
  const now = Date.now();
  accounts.set(id, {
    profile: {
      id,
      name: "Bagas Anggana",
      username: "bagas",
      email: "bagas@example.com",
      phone: "0812 1234 0404",
      balance: 4_250_000,
      hasPin: true,
    },
    transactions: [
      {
        id: "demo-1",
        name: "Nadia Putri",
        amount: 150_000,
        direction: "out",
        kind: "transfer",
        status: "success",
        date: new Date(now - 3_600_000).toISOString(),
        notes: "Makan siang",
      },
      {
        id: "demo-2",
        name: "Isi saldo",
        amount: 1_000_000,
        direction: "in",
        kind: "topup",
        status: "success",
        date: new Date(now - 7_200_000).toISOString(),
        notes: "Isi saldo dompet",
      },
      {
        id: "demo-3",
        name: "Arif Rahman",
        amount: 75_000,
        direction: "out",
        kind: "transfer",
        status: "success",
        date: new Date(now - 86_400_000).toISOString(),
        notes: "Kopi sore",
      },
      {
        id: "demo-4",
        name: "Dinda Ayu",
        amount: 250_000,
        direction: "out",
        kind: "transfer",
        status: "success",
        date: new Date(now - 172_800_000).toISOString(),
        notes: "Patungan hadiah",
      },
    ],
    salt,
    pinHash: scryptSync("123456", salt, 32),
    passwordHash: scryptSync("Demo12345!", salt, 32),
    attempts: 0,
    lockedUntil: 0,
    expires: now + 28_800_000,
    requests: new Map(),
  });
  return id;
}
export function demoAccount(id: string) {
  const account = accounts.get(id);
  if (!account || account.expires <= Date.now()) {
    accounts.delete(id);
    throw new AppError("Sesi demo berakhir. Buka demo kembali.", 401);
  }
  return account;
}
export function deleteDemo(id: string) {
  accounts.delete(id);
}
export function verifyDemoPin(id: string, pin: string) {
  const account = demoAccount(id);
  if (account.lockedUntil > Date.now())
    throw new AppError("Terlalu banyak percobaan. Tunggu 1 menit.", 429);
  if (
    !timingSafeEqual(
      scryptSync(pinValue(pin), account.salt, 32),
      account.pinHash,
    )
  ) {
    account.attempts++;
    if (account.attempts >= 5) {
      account.lockedUntil = Date.now() + 60_000;
      account.attempts = 0;
    }
    throw new AppError(
      "PIN tidak sesuai. Periksa kembali PIN kamu.",
      400,
      "INVALID_PIN",
    );
  }
  account.attempts = 0;
}
export function demoTransfer(
  id: string,
  recipientId: string,
  value: unknown,
  pin: string,
  notes: string,
  requestKey: string,
) {
  const account = demoAccount(id);
  const fingerprint = JSON.stringify([
    "transfer",
    recipientId,
    Number(value),
    notes,
  ]);
  const previous = account.requests.get(requestKey);
  if (previous) {
    if (previous.fingerprint !== fingerprint)
      throw new AppError(
        "ID permintaan sudah digunakan untuk transaksi lain.",
        409,
      );
    return account.transactions.find((t) => t.id === previous.id)!;
  }
  const recipient = demoRecipients.find((p) => p.id === recipientId);
  if (!recipient) throw new AppError("Penerima tidak ditemukan.", 404);
  const amount = amountValue(value, account.profile.balance);
  verifyDemoPin(id, pin);
  const transaction: Transaction = {
    id: "DEMO-" + randomUUID(),
    name: recipient.name,
    amount,
    direction: "out",
    kind: "transfer",
    status: "success",
    date: new Date().toISOString(),
    notes,
  };
  account.profile.balance! -= amount;
  account.transactions.unshift(transaction);
  account.requests.set(requestKey, { id: transaction.id, fingerprint });
  return transaction;
}
export function demoTopup(id: string, value: unknown, requestKey: string) {
  const account = demoAccount(id);
  const fingerprint = JSON.stringify(["topup", Number(value)]);
  const previous = account.requests.get(requestKey);
  if (previous) {
    if (previous.fingerprint !== fingerprint)
      throw new AppError(
        "ID permintaan sudah digunakan untuk transaksi lain.",
        409,
      );
    return account.transactions.find((t) => t.id === previous.id)!;
  }
  const amount = amountValue(value);
  const transaction: Transaction = {
    id: "DEMO-" + randomUUID(),
    name: "Isi saldo",
    amount,
    direction: "in",
    kind: "topup",
    status: "success",
    date: new Date().toISOString(),
    notes: "Simulasi isi saldo",
  };
  account.profile.balance! += amount;
  account.transactions.unshift(transaction);
  account.requests.set(requestKey, { id: transaction.id, fingerprint });
  return transaction;
}
export function changeDemoPin(id: string, pin: string) {
  const a = demoAccount(id);
  a.pinHash = scryptSync(pinValue(pin), a.salt, 32);
  a.profile.hasPin = true;
}
export function changeDemoPassword(id: string, current: string, next: string) {
  const a = demoAccount(id);
  if (!timingSafeEqual(scryptSync(current, a.salt, 32), a.passwordHash))
    throw new AppError("Password saat ini tidak sesuai.");
  a.passwordHash = scryptSync(next, a.salt, 32);
}
