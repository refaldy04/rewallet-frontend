import { Brand } from "@/components/ui";
import ProductPreview from "@/components/product-preview";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="auth-layout">
      <aside className="auth-story">
        <Brand inverse />
        <div>
          <h2>
            Rencana besar,
            <br />
            mulai dari dompet
            <br />
            yang teratur.
          </h2>
          <p>
            Satu tempat untuk kirim uang, melihat saldo, dan mengikuti setiap
            langkah kecilmu.
          </p>
          <div className="mt-10 max-w-sm">
            <ProductPreview />
          </div>
        </div>
        <small>
          © {new Date().getFullYear()} rewallet. · Pratinjau menggunakan data
          contoh.
        </small>
      </aside>
      <section className="auth-content">{children}</section>
    </main>
  );
}
