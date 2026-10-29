import { ProfileForm } from "@/components/profile";
export const metadata = { title: "Informasi personal" };
export default function Page() {
  return <ProfileForm kind="personal" />;
}
