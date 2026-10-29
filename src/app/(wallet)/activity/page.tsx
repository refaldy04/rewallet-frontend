import { Suspense } from "react";
import Activity from "@/components/activity";
import { Loading } from "@/components/ui";
export const metadata = { title: "Aktivitas" };
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Activity />
    </Suspense>
  );
}
