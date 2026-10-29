import { Suspense } from "react";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/session";
import AuthForm from "@/components/auth-form";
import { Loading } from "@/components/ui";
export const metadata = { title: "Masuk" };
export default async function LoginPage() {
  const session = await readSession();
  if (session) redirect(session.hasPin ? "/dashboard" : "/onboarding/pin");
  return (
    <Suspense fallback={<Loading />}>
      <AuthForm
        mode="login"
        connected={Boolean(process.env.BACKEND_URL)}
        demoEnabled={
          process.env.NODE_ENV !== "production" ||
          process.env.DEMO_ENABLED === "true"
        }
      />
    </Suspense>
  );
}
