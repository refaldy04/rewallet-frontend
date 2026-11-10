import Topup from "@/components/topup";
export const metadata = { title: "Isi saldo" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ topup_id?: string | string[] }>;
}) {
  const { topup_id } = await searchParams;
  const id = typeof topup_id === "string" ? topup_id : undefined;
  return <Topup key={id ?? "new"} topupId={id} />;
}
