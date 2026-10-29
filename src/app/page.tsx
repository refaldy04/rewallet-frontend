import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/session";
import { Brand, Icon, LinkButton } from "@/components/ui";
import ProductPreview from "@/components/product-preview";
export default async function LandingPage() {
  const session = await readSession();
  if (session) redirect(session.hasPin ? "/dashboard" : "/onboarding/pin");
  return (
    <div className="landing">
      <a className="skip-link" href="#tentang">
        Lewati ke konten
      </a>
      <nav
        className="landing-nav landing-container"
        aria-label="Navigasi beranda"
      >
        <Brand />
        <div className="landing-nav-links">
          <a href="#tentang">Tentang rewallet</a>
          <a href="#fitur">Fitur</a>
          <a href="#cerita">Cerita pengguna</a>
        </div>
        <div className="landing-nav-actions">
          <LinkButton href="/login">Masuk</LinkButton>
          <LinkButton href="/sign-up" variant="contained">
            Daftar <Icon name="next" className="ml-2" />
          </LinkButton>
        </div>
      </nav>
      <main>
        <section
          className="hero landing-container"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <p className="eyebrow">DOMPET PERSONAL, PIKIRAN LEBIH RINGAN</p>
            <h1 id="hero-title">
              Uangmu teratur.
              <br />
              Harimu <em>lebih tenang.</em>
            </h1>
            <p>
              Kirim uang, isi saldo, dan lihat setiap transaksi. Semua kebutuhan
              dompetmu, dalam satu tempat yang sederhana.
            </p>
            <div className="hero-actions">
              <LinkButton
                href="/sign-up"
                variant="contained"
                endIcon={<Icon name="next" />}
              >
                Mulai dengan rewallet
              </LinkButton>
              <LinkButton href="/login" variant="outlined">
                Lihat aplikasinya
              </LinkButton>
            </div>
            <span className="browser-note">
              <Icon name="download" />
              Akses langsung dari browser, tanpa unduh aplikasi.
            </span>
          </div>
          <div className="hero-visual">
            <ProductPreview />
            <div className="floating-note">
              <span>
                <Icon name="check" />
              </span>
              <div>
                <strong>Semua lebih jelas.</strong>
                <small>Satu tempat untuk aktivitas uangmu.</small>
              </div>
            </div>
            <p className="visual-caption">Pratinjau produk · data contoh</p>
          </div>
        </section>
        <section className="logo-section" aria-label="Logo ilustrasi">
          <div className="landing-container">
            <div className="logo-list">
              {["microsoft", "dropbox", "hm", "airbnb", "canon", "dell"].map(
                (name) => (
                  <Image
                    key={name}
                    src={"/images/" + name + ".png"}
                    alt={name === "hm" ? "H&M" : name}
                    width={110}
                    height={40}
                  />
                ),
              )}
            </div>
            <p>Logo ilustrasi. Tidak menunjukkan kemitraan atau afiliasi.</p>
          </div>
        </section>
        <section id="tentang" className="landing-section landing-container">
          <div className="section-heading">
            <p className="eyebrow">TENTANG APLIKASI</p>
            <h2>
              Lebih sederhana.
              <br />
              Lebih dekat dengan kebutuhanmu.
            </h2>
            <p>
              Urus kebutuhan dompet sehari-hari dengan tampilan yang fokus pada
              hal yang kamu perlukan.
            </p>
          </div>
          <div className="about-grid">
            <article className="about-card">
              <span className="about-icon">
                <Icon name="phone" />
              </span>
              <h3>Bantuan saat dibutuhkan</h3>
              <p>
                Temukan informasi kontak dan panduan penggunaan dengan mudah
                saat kamu membutuhkan bantuan.
              </p>
            </article>
            <article className="about-card featured">
              <span className="about-icon">
                <Icon name="lock" />
              </span>
              <h3>Kendali atas privasi</h3>
              <p>
                Sembunyikan saldo saat membuka dompet di tempat umum. Tinjau
                penerima dan nominal sebelum memasukkan PIN.
              </p>
            </article>
            <article className="about-card">
              <span className="about-icon">
                <Icon name="download" />
              </span>
              <h3>Langsung buka, langsung akses</h3>
              <p>
                Gunakan rewallet melalui browser di ponsel maupun komputer.
                Tidak perlu memasang aplikasi tambahan.
              </p>
            </article>
          </div>
        </section>
        <section id="fitur" className="features-section">
          <div className="features-grid landing-section landing-container">
            <div className="feature-visual">
              <ProductPreview />
              <p className="visual-caption">
                Tampilan dompet · nominal ilustrasi
              </p>
            </div>
            <div className="features-copy">
              <p className="eyebrow">FITUR YANG MEMUDAHKAN</p>
              <h2>
                Hal kecil yang membuat
                <br />
                perbedaan besar.
              </h2>
              {[
                [
                  "Nominal yang jelas",
                  "Periksa nominal, penerima, catatan, dan sisa saldo sebelum melanjutkan transfer.",
                ],
                [
                  "Kontrol akun di tanganmu",
                  "Kelola informasi personal, nomor telepon, password, dan PIN melalui satu menu profil.",
                ],
                [
                  "Mudah dipahami, setiap hari",
                  "Lihat uang masuk dan keluar lewat aktivitas yang rapi. Cari transaksi tanpa perlu menebak.",
                ],
              ].map(([title, text], i) => (
                <article className="feature-item" key={title}>
                  <b>0{i + 1}</b>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="cerita" className="landing-section landing-container">
          <div className="section-heading">
            <p className="eyebrow">CERITA PENGGUNA</p>
            <h2>
              Lebih banyak waktu
              <br />
              untuk hal yang berarti.
            </h2>
            <p>
              Gambaran pengalaman yang ingin kami hadirkan untuk kebutuhan
              dompet sehari-hari.
            </p>
          </div>
          <article className="testimonial">
            <Image
              src="/images/alex.png"
              alt="Avatar ilustrasi Alex"
              width={64}
              height={64}
            />
            <h3>Alex Hansinburg</h3>
            <p>Desainer · persona ilustrasi</p>
            <blockquote>
              “Di tengah kesibukan, saya ingin urusan kirim uang terasa
              sederhana. Bisa melihat saldo dan aktivitas dalam satu tempat
              membuat semuanya lebih mudah diikuti.”
            </blockquote>
            <small>
              Testimoni ilustrasi untuk pratinjau desain, bukan ulasan pengguna
              terverifikasi.
            </small>
          </article>
        </section>
        <div className="landing-container">
          <section className="landing-cta">
            <div>
              <h2>Mulai langkah kecilmu hari ini.</h2>
              <p>Dompet lebih teratur, ruang lebih luas untuk rencanamu.</p>
            </div>
            <LinkButton
              href="/sign-up"
              variant="contained"
              endIcon={<Icon name="next" />}
            >
              Buat akun rewallet
            </LinkButton>
          </section>
        </div>
      </main>
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-top">
            <div>
              <Brand inverse />
              <p>
                Sederhanakan kebutuhan dompetmu. Kirim uang, pantau aktivitas,
                dan lanjutkan harimu dengan lebih tenang.
              </p>
            </div>
            <div className="landing-footer-links">
              <a href="#tentang">Tentang</a>
              <a href="#fitur">Fitur</a>
              <Link href="/login">Masuk</Link>
              <Link href="/sign-up">Daftar</Link>
            </div>
          </div>
          <div className="landing-footer-bottom">
            <p>© {new Date().getFullYear()} rewallet. Hak cipta dilindungi.</p>
            <div>
              <span>Kontak referensi: +62 5637 8882 9901</span>
              <span>contact@rewallet.com · belum diverifikasi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
