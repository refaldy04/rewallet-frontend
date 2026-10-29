import TransactionDetail from "@/components/transaction-detail";
export const metadata = { title: "Detail aktivitas" };
export default async function Page({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  return <TransactionDetail id={(await params).transactionId} />;
}
