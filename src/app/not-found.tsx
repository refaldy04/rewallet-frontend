import { Brand, LinkButton } from "@/components/ui";
export default function NotFound() {
  return (
    <main className="standalone">
      <Brand />
      <div className="standalone-card">
        <p className="eyebrow">404 · SALAH ALAMAT</p>
        <h1>Sepertinya kamu tersesat.</h1>
        <p>Halaman ini tidak ditemukan. Mari kembali ke tempat yang tepat.</p>
        <LinkButton variant="contained" href="/dashboard">
          Kembali ke ringkasan
        </LinkButton>
      </div>
    </main>
  );
}
