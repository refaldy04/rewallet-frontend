import { Suspense } from "react";
import { TransferRecipients } from "@/components/transfer";
import { Loading } from "@/components/ui";
export const metadata = { title: "Transfer" };
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <TransferRecipients />
    </Suspense>
  );
}
