import { Suspense } from "react";
import AuthForm from "@/components/auth-form";
import { Loading } from "@/components/ui";
export const metadata = { title: "Pemulihan akun" };
export const dynamic = "force-dynamic";
export default function RecoveryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthForm
        mode="recovery"
        connected={Boolean(
          process.env.BACKEND_URL && process.env.BACKEND_RECOVERY_PATH,
        )}
      />
    </Suspense>
  );
}
