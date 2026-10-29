import "server-only";
import { decodeSession, encodeSession } from "./session-codec";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Session } from "./types";
const COOKIE = "rewallet_session";
export async function readSession(): Promise<Session | null> {
  return decodeSession((await cookies()).get(COOKIE)?.value);
}
export async function writeSession(session: Session) {
  const value = encodeSession(session);
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(0, Math.floor((session.expires - Date.now()) / 1000)),
  });
}
export async function clearSession() {
  (await cookies()).delete(COOKIE);
}
export async function requireSession(onboarding = false) {
  const session = await readSession();
  if (!session) redirect("/login");
  if (!onboarding && !session.hasPin) redirect("/onboarding/pin");
  return session;
}
