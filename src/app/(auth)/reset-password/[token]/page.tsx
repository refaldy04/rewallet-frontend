import { Suspense } from "react";
import AuthForm from "@/components/auth-form";
import { Loading } from "@/components/ui";
export const metadata = {
  title: "Password baru",
  robots: { index: false, follow: false },
};
export default async function ResetPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <Suspense fallback={<Loading />}>
      <AuthForm
        mode="reset"
        token={token}
        connected={Boolean(
          process.env.BACKEND_URL && process.env.BACKEND_RESET_PATH,
        )}
      />
    </Suspense>
  );
}
