import type {
  TopupAction,
  TopupIntent,
  TopupMethod,
  TopupPayment,
} from "./types";
import { AppError } from "./validation";

const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const string = (value: unknown) => (typeof value === "string" ? value : "");
const states = new Set([
  "CREATED",
  "UNKNOWN",
  "PENDING",
  "REQUIRES_ACTION",
  "ACCEPTING_PAYMENTS",
  "AUTHORIZED",
  "SUCCEEDED",
  "FAILED",
  "CANCELED",
  "EXPIRED",
]);

export function topupIdValue(value: unknown) {
  if (
    typeof value !== "string" ||
    !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value)
  )
    throw new AppError("ID isi saldo tidak valid.");
  return value;
}

export function topupAmountValue(value: unknown, method?: TopupMethod) {
  const amount = Number(value);
  if (
    (typeof value !== "number" &&
      (typeof value !== "string" || !/^\d+$/.test(value))) ||
    !Number.isSafeInteger(amount) ||
    amount <= 0
  )
    throw new AppError("Masukkan nominal dalam rupiah bulat.");
  if (method && (amount < method.minAmount || amount > method.maxAmount))
    throw new AppError("Nominal di luar batas metode pembayaran yang dipilih.");
  return amount;
}

export function normalizeTopupMethods(data: unknown): TopupMethod[] {
  const result = object(data).result;
  if (!Array.isArray(result))
    throw new AppError("Daftar metode pembayaran tidak valid.", 502);
  return result.map((value) => {
    const method = object(value);
    const minAmount = topupAmountValue(method.min_amount);
    const maxAmount = topupAmountValue(method.max_amount);
    if (
      method.currency !== "IDR" ||
      !/^[A-Z_]{1,50}$/.test(string(method.channel_code)) ||
      minAmount > maxAmount
    )
      throw new AppError("Metode pembayaran dari layanan tidak valid.", 502);
    return {
      channelCode: string(method.channel_code),
      name: string(method.name) || string(method.channel_code),
      minAmount,
      maxAmount,
    };
  });
}

export function topupSucceeded(payment: TopupPayment) {
  return payment.status === "SUCCEEDED" && !!payment.transactionId;
}
export function topupFinished(payment: TopupPayment) {
  return (
    topupSucceeded(payment) ||
    ["FAILED", "CANCELED", "EXPIRED"].includes(payment.status)
  );
}

function safeAction(value: unknown): TopupAction | null {
  const action = object(value),
    descriptor = string(action.descriptor),
    content = string(action.value);
  if (!content || content.length > 16384) return null;
  if (action.type === "PRESENT_TO_CUSTOMER" && descriptor === "QR_STRING")
    return { descriptor, value: content };
  if (
    action.type !== "REDIRECT_CUSTOMER" ||
    !["WEB_URL", "DEEPLINK_URL"].includes(descriptor)
  )
    return null;
  try {
    const url = new URL(content);
    if (
      url.username ||
      url.password ||
      (descriptor === "WEB_URL"
        ? url.protocol !== "https:"
        : !["https:", "dana:", "shopee:", "shopeeid:", "shopeepay:"].includes(
            url.protocol,
          ))
    )
      return null;
    return {
      descriptor: descriptor as "WEB_URL" | "DEEPLINK_URL",
      value: content,
    };
  } catch {
    return null;
  }
}

export function normalizeTopup(data: unknown): TopupPayment {
  const payment = object(object(data).result);
  try {
    const id = topupIdValue(payment.id),
      amount = topupAmountValue(payment.amount);
    if (
      payment.currency !== "IDR" ||
      !/^[A-Z_]{1,50}$/.test(string(payment.channel_code))
    )
      throw new Error();
    const status = (
      states.has(string(payment.status)) ? payment.status : "UNKNOWN"
    ) as TopupPayment["status"];
    const transactionId =
      typeof payment.transaction_id === "string" ||
      typeof payment.transaction_id === "number"
        ? String(payment.transaction_id) || null
        : null;
    return {
      id,
      amount,
      status,
      transactionId,
      channelCode: string(payment.channel_code),
      actions: ["SUCCEEDED", "FAILED", "CANCELED", "EXPIRED"].includes(status)
        ? []
        : Array.isArray(payment.actions)
          ? payment.actions.map(safeAction).filter((a): a is TopupAction => !!a)
          : [],
      expiresAt: string(payment.expires_at),
      paidAt: string(payment.paid_at),
      createdAt: string(payment.created_at),
    };
  } catch {
    throw new AppError(
      "Status isi saldo belum dapat dipastikan. Periksa kembali dengan permintaan yang sama.",
      502,
      "UNCERTAIN",
    );
  }
}

export function readTopupIntent(raw: string | null): TopupIntent | null {
  try {
    const intent = object(JSON.parse(raw ?? "null"));
    if (
      typeof intent.key !== "string" ||
      !/^[a-f0-9-]{36}$/i.test(intent.key) ||
      typeof intent.channelCode !== "string" ||
      !/^[A-Z_]{1,50}$/.test(intent.channelCode)
    )
      return null;
    return {
      key: intent.key,
      amount: topupAmountValue(intent.amount),
      channelCode: intent.channelCode,
      ...(intent.id ? { id: topupIdValue(intent.id) } : {}),
    };
  } catch {
    return null;
  }
}
