# rewallet.

Dompet, lebih teratur. Migrasi dari Create React App ke **Next.js 16.4.3 App Router**, React 19, TypeScript, **Tailwind CSS 4**, dan **Material UI 9**. Desain mengikuti `rewallet-redesign.html` dan routing mengikuti `routing-and-redesign.md` di root.

## Menjalankan aplikasi

Gunakan Node.js ≥20.9 dan npm. `package-lock.json` adalah lockfile yang digunakan proyek ini; dependency Bootstrap, React Router, Redux Persist, dan CRA sudah dihapus.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Pada PowerShell, gunakan `Copy-Item .env.example .env.local`. Buka http://localhost:3000. `.env` lama tidak diubah; variabel `REACT_APP_*` sudah tidak digunakan. Pindahkan alamat backend ke `BACKEND_URL` di `.env.local` bila ingin menghubungkannya.

Tanpa backend, buka **Masuk → Coba akun demo**. PIN awal **123456**, password awal **Demo12345!**. Setiap sesi memiliki akun, saldo, profil, dan transaksi contoh sendiri. Perubahan bertahan saat refresh, tetapi dihapus saat logout, sesi berakhir (8 jam), atau proses server dimulai ulang. Penyimpanan demo berada di memori satu proses, sehingga tidak ditujukan untuk deployment dengan banyak instance.

```sh
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
npm start
```

Pengujian E2E memakai Chrome desktop dan viewport iPhone melalui Playwright. Install Google Chrome atau ubah `channel: 'chrome'` di `playwright.config.ts` sesuai browser yang tersedia. Test server menggunakan port 3100, tanpa mengakses backend asli.

Untuk produksi, set **SESSION_SECRET** acak minimal 32 karakter, misalnya hasil `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Secret harus sama di semua instance. Gunakan HTTPS. Demo dimatikan di produksi; aktifkan `DEMO_ENABLED=true` hanya untuk preview yang memang membutuhkan simulasi. Jalankan ulang build setelah mengganti konfigurasi ketersediaan form auth/recovery karena beberapa halaman publik diprarender.

## Cakupan

- Landing mempertahankan hero, section logo, tentang aplikasi, fitur, testimoni, dan footer. Visual produk mengikuti tema Calm Money. Logo dan testimoni diberi konteks ilustrasi; klaim keamanan, biaya, mitra, serta ketersediaan aplikasi seluler yang belum terverifikasi diganti dengan penjelasan fitur.
- Shared layout desktop/mobile, lima tujuan navigasi dengan state aktif dari URL, skip link, fokus keyboard, status loading/error/empty, bahasa Indonesia, IDR, dan waktu Asia/Jakarta.
- Autentikasi, registrasi, recovery berbasis token, onboarding PIN, ringkasan, pencarian penerima, transfer tiga langkah, hasil berdasarkan ID transaksi, isi saldo, aktivitas dengan pagination/filter, profil, foto dengan preview, nomor telepon, password, dan PIN.
- URL lama dialihkan lewat `next.config.ts`. URL transfer/hasil lama tanpa ID kembali ke pemilihan penerima atau aktivitas. Route percobaan `/counter` dihapus dan URL tak dikenal menampilkan 404.
- Nominal dan catatan transfer bertahan dalam draft `sessionStorage`; PIN/password/token tidak disimpan di browser storage. ID penerima ada di URL. Review tanpa draft kembali ke pemilihan penerima. Grafik dihitung dari aktivitas yang benar-benar dimuat, dengan cakupan data dijelaskan.

## Sesi dan API

Browser hanya memanggil route `/api/wallet/*` di origin yang sama. Backend dipanggil dari server melalui adapter `src/lib/backend.ts` dan `src/lib/data.ts`; alamat maupun token backend tidak dikirim sebagai konfigurasi client.

Cookie sesi dienkripsi dan diautentikasi menggunakan AES-256-GCM, bersifat HttpOnly, SameSite=Lax, Secure pada produksi, dan berakhir setelah 8 jam. Proxy, layout, serta API semuanya memeriksa akses. Tujuan setelah login dibatasi ke route aplikasi. Respons API tidak dicache, form mutasi memeriksa Origin, input divalidasi ulang di server, dan profil yang dikirim ke client memakai whitelist field. PIN dari respons backend lama hanya digunakan untuk menentukan `hasPin`, lalu dibuang. Payload `persist:auth` dari versi CRA dibersihkan ketika aplikasi dibuka.

Demo memverifikasi hash PIN di server, membatasi percobaan, dan memakai idempotency key agar permintaan yang sama tidak mengubah saldo dua kali. Pembatasan request lokal hanyalah pertahanan tambahan per proses; produksi memerlukan pembatasan login/PIN, pencabutan sesi, idempotensi, otorisasi, dan penyimpanan transaksi yang konsisten di backend. Logout menghapus sesi browser; pencabutan token backend perlu disediakan oleh backend.

## Menghubungkan backend

`BACKEND_URL` berisi base URL API. Adapter mempertahankan endpoint yang ditemukan dalam repo lama, dengan body URL-encoded dan `Authorization: Bearer` di server:

| Fitur                | Endpoint backend                                                   |
| -------------------- | ------------------------------------------------------------------ |
| Masuk / daftar       | `POST /auth/login`, `POST /auth/register`                          |
| Profil / edit / foto | `GET /profile`, `PATCH /profile/` (foto multipart field `picture`) |
| Penerima             | `GET /allProfile?search=&page=&limit=8`, `GET /admin/profile/:id`  |
| Aktivitas            | `GET /historyTransaction?limit=8&page=`                            |
| Onboarding           | `POST /auth/createPin` dengan PIN dan email dari profil sesi       |
| Password             | `PATCH /changePassword` dengan `password`, `newpassword`           |
| Transfer / isi saldo | `POST /transfer`, `POST /topup` dengan `Idempotency-Key`           |

Respons login: `{ result: { token, user_id, hasPin } }`; legacy `pin` hanya diturunkan menjadi boolean dan tidak diteruskan. Profil dapat berupa `{ result: profile }` atau `{ result: [profile] }`. Daftar: `{ result: [...], pageInfo: { totalPages } }`. Sesuaikan adapter bila kontrak deployment berbeda, termasuk izin endpoint lookup penerima yang saat ini mengikuti path lama.

**Transfer uang nyata sengaja belum diaktifkan secara default.** Audit source lama tidak membuktikan backend memverifikasi PIN. Aktifkan `BACKEND_TRANSFER_SUPPORTS_PIN=true` hanya setelah `/transfer` memvalidasi PIN, saldo, penerima, otorisasi, dan idempotency key secara atomik di server. Isi `BACKEND_TRANSACTION_PATH`, misalnya `/transactions`, agar detail dapat diambil dari `GET /transactions/:id` menggunakan token sesi. Isi saldo juga memerlukan detail/status transaksi sebelum diaktifkan. Tidak ada nomor VA, pilihan bank, PDF, atau tombol share palsu.

Kontrak transaksi untuk mutasi dan detail: `{ result: { id, amount, status, sender_id, recipient_id, fullname, created_at, notes, type_id } }`. Status harus eksplisit (`success`/`completed`, `failed`/`rejected`, atau `pending`). Respons tanpa status diperlakukan sebagai menunggu, tanpa arah pengirim/penerima tidak diasumsikan sebagai pengeluaran. Detail ID wajib diotorisasi backend untuk akun tersebut. Respons mutasi tanpa ID atau timeout dianggap belum pasti; pengguna diminta memeriksa aktivitas sebelum mencoba kembali.

Endpoint baru berikut bersifat opt-in dan **tidak** menggunakan alur reset berbasis ID Redux lama:

| Variabel                  | Metode / kontrak                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `BACKEND_CHANGE_PIN_PATH` | `PATCH`, body `pin`, `newpin`; backend memverifikasi PIN lama dan membatasi percobaan                        |
| `BACKEND_RECOVERY_PATH`   | `POST`, body `email`; kirim tautan `/reset-password/:token`, respons netral tanpa mengungkap keberadaan akun |
| `BACKEND_RESET_PATH`      | `POST`, body `token`, `password`; token harus kedaluwarsa, sekali pakai, dan diverifikasi backend            |

Jika endpoint belum dikonfigurasi, UI/API memberikan pesan bahwa layanan belum tersedia. Keberhasilan tidak disimulasikan untuk akun nyata. `rewallet-redesign.html` tetap menjadi referensi mandiri, terpisah dari aplikasi Next.js.

## Struktur

```text
src/app/(auth)/        Auth, recovery, onboarding
src/app/(wallet)/      Route dompet dengan shared layout
src/app/api/wallet/    Backend-for-frontend dengan sesi dan validasi
src/components/       UI Material UI, layout, dan layar
src/lib/              Adapter backend, demo server, sesi, validasi, format
src/proxy.ts          Redirect auth/onboarding dan returnTo
tests/                Unit/integrasi domain dan E2E desktop/mobile
public/images/        Aset landing yang dipertahankan
```

Backend produksi tidak tersedia dalam workspace ini. Pengujian demo tidak membuktikan payment gateway, kontrak API produksi, atau keamanan backend lama telah diverifikasi.
