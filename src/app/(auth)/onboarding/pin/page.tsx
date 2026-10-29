import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import { OnboardingPin } from "@/components/profile";
export const metadata = { title: "Buat PIN" };
export default async function Page() {
  const session = await requireSession(true);
  if (session.hasPin) redirect("/dashboard");
  return <OnboardingPin />;
}
