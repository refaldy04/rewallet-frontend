import { TransferAmount } from "@/components/transfer";
export const metadata = { title: "Nominal transfer" };
export default async function Page({
  params,
}: {
  params: Promise<{ recipientId: string }>;
}) {
  return <TransferAmount recipientId={(await params).recipientId} />;
}
