import { ProfileForm } from "@/components/profile";
export const metadata = { title: "Ganti password" };
export default function Page() {
  return <ProfileForm kind="password" />;
}
