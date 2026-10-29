import type { Metadata } from "next";
import Providers from "@/components/providers";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "rewallet. — Dompet, lebih teratur.",
    template: "%s — rewallet.",
  },
  description:
    "Kirim uang, isi saldo, dan pantau aktivitas dompetmu dalam satu tempat yang lebih teratur.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
