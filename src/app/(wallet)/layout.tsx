import { requireSession } from "@/lib/session";
import WalletShell from "@/components/wallet-shell";
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  return <WalletShell demo={session.mode === "demo"}>{children}</WalletShell>;
}
