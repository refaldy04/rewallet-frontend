export class AppError extends Error {
  constructor(
    message: string,
    public status = 400,
    public code = "INVALID_REQUEST",
  ) {
    super(message);
  }
}
export function amountValue(value: unknown, balance?: number | null) {
  if (
    typeof value !== "number" &&
    (typeof value !== "string" || !/^\d+$/.test(value))
  )
    throw new AppError("Masukkan nominal dalam rupiah bulat.");
  const amount = Number(value);
  if (!Number.isSafeInteger(amount) || amount < 10_000 || amount > 5_000_000)
    throw new AppError(
      "Nominal harus Rp10.000–Rp5.000.000 dalam rupiah bulat.",
    );
  if (balance !== undefined && (balance === null || amount > balance))
    throw new AppError("Saldo belum tersedia atau tidak mencukupi.");
  return amount;
}
export function textValue(value: unknown, label: string, min = 1, max = 100) {
  if (
    typeof value !== "string" ||
    value.trim().length < min ||
    value.trim().length > max
  )
    throw new AppError(`${label} harus ${min}–${max} karakter.`);
  return value.trim();
}
export function pinValue(value: unknown) {
  if (typeof value !== "string" || !/^\d{6}$/.test(value))
    throw new AppError("PIN harus terdiri dari 6 angka.");
  return value;
}
export function passwordValue(value: unknown) {
  if (typeof value !== "string" || value.length < 8 || value.length > 128)
    throw new AppError("Password harus 8–128 karakter.");
  return value;
}
export function emailValue(value: unknown) {
  const email = textValue(value, "Email", 3, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new AppError("Masukkan alamat email yang valid.");
  return email;
}
export function safeReturnTo(value: unknown) {
  return typeof value === "string" &&
    /^\/(dashboard|transfer|top-up|activity|profile|transactions)(\/|\?|$)/.test(
      value,
    ) &&
    !/[\\\r\n]/.test(value)
    ? value
    : "/dashboard";
}
export function idValue(value: unknown) {
  if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(value))
    throw new AppError("ID tidak valid.", 400);
  return value;
}
