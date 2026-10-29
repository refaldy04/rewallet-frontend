import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import type { Session } from "./types";
const runtime = globalThis as typeof globalThis & {
  rewalletDevSecret?: string;
};
function key() {
  let secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production")
      throw new Error("SESSION_SECRET must contain at least 32 characters.");
    secret = runtime.rewalletDevSecret ??= randomBytes(32).toString("hex");
  }
  return createHash("sha256").update(secret).digest();
}
export function encodeSession(session: Session) {
  const iv = randomBytes(12),
    cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([
    cipher.update(JSON.stringify(session)),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), data]
    .map((v) => v.toString("base64url"))
    .join(".");
}
export function decodeSession(raw?: string): Session | null {
  if (!raw) return null;
  try {
    const parts = raw.split(".");
    if (parts.length !== 3) return null;
    const [iv, tag, data] = parts.map((v) => Buffer.from(v, "base64url"));
    const decipher = createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(tag);
    const s = JSON.parse(
      Buffer.concat([decipher.update(data), decipher.final()]).toString(),
    ) as Session;
    if (
      typeof s.id !== "string" ||
      !s.id ||
      !["demo", "live"].includes(s.mode) ||
      typeof s.hasPin !== "boolean" ||
      !Number.isFinite(s.expires) ||
      s.expires <= Date.now() ||
      (s.mode === "live" && typeof s.token !== "string")
    )
      return null;
    return s;
  } catch {
    return null;
  }
}
