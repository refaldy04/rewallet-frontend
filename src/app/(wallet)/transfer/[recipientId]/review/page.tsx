import { TransferReview } from "@/components/transfer";
export const metadata = { title: "Konfirmasi transfer" };
export default async function Page({
  params,
}: {
  params: Promise<{ recipientId: string }>;
}) {
  return <TransferReview recipientId={(await params).recipientId} />;
}
