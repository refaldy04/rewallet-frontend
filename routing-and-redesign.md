# Rewallet — audit routing dan rancangan tampilan baru

Sumber: https://github.com/refaldy04/rewallet-frontend
Commit yang diperiksa: `c93c902fdfbaaf4a20bfd16578ee3ed2199aa65a`.
Tanggal audit: 28 Oktober 2026. Pemeriksaan statis source; backend dan aplikasi produksi tidak diuji. CSS lama dan Bootstrap tidak dijadikan acuan visual.

## Hasil desain

Buka `rewallet-redesign.html` langsung di browser. Prototipe mandiri, tanpa dependency, tanpa API, dan tanpa Bootstrap. Semua nominal, kontak, grafik, dan transaksi merupakan data contoh. Transfer dan isi saldo hanya simulasi di memori; refresh mengembalikan data awal. Jangan memasukkan kredensial asli.

Cakupan prototipe: ringkasan, pencarian penerima, nominal transfer, pemeriksaan dan PIN, hasil simulasi, isi saldo, aktivitas dengan filter, profil, informasi personal, serta rancangan form password/PIN. Navigasi mengikuti hash URL sehingga Back/Forward bisa dipakai. Login, registrasi, recovery, dan pengelolaan nomor dijelaskan di spesifikasi, belum dibuat menjadi layar interaktif. Source React lama tidak diubah.

## Struktur saat ini

React 18 + Create React App, React Router 6, Redux Toolkit, Redux Persist, Axios, Formik dan Yup. `src/index.js` memasang BrowserRouter dan PersistGate. Semua route didefinisikan secara datar di `src/App.js`. Tiap halaman merakit Navbar, Sidebar dan navigasi mobile sendiri; belum ada shared layout berbasis Outlet.

| Route saat ini | Akses dalam App.js | Fungsi dan alur |
| --- | --- | --- |
| `/` | Publik | Landing; pengguna dengan token diarahkan ke dashboard |
| `/login` | Publik | Login → dashboard; sudah bertoken → dashboard |
| `/sign-up` | Publik | Registrasi → login; sudah bertoken → dashboard |
| `/confirm-email` | Publik | Pencarian email recovery → reset-password |
| `/reset-password` | Publik | Password baru menggunakan ID pada state → login |
| `/dashboard` | Token | Ringkasan, saldo, cuplikan transaksi; tanpa PIN diarahkan ke create-pin |
| `/create-pin` | Token | Buat PIN → dashboard melalui callback |
| `/create-pin-success` | Publik | Halaman sukses tersedia, tidak dilewati callback create-pin saat ini |
| `/search-receiver` | Token | Cari/pilih penerima → input-amount |
| `/input-amount` | Token | Ambil profil penerima dari ID Redux, isi nominal/catatan → confirmation |
| `/confirmation` | Token | Ringkasan → modal PIN |
| `/status-success` | Token | Layar hasil; detail transaksi masih hardcoded |
| `/status-failed` | Token | Layar gagal; coba lagi → confirmation |
| `/top-up` | Token | Isi nominal di modal; langsung navigasi ke dashboard setelah dispatch |
| `/profile` | Token | Foto profil, tautan informasi personal/password/PIN, logout |
| `/personal-information` | Token | Nama, username, email, nomor; akses pengelolaan nomor |
| `/manage-phone-number` | Token | Nomor saat ini; ikon hapus justru membuka add-phone-number |
| `/add-phone-number` | Token | Form nomor → personal-information |
| `/change-password` | Token | Form ganti password |
| `/change-pin` | Token | UI placeholder dengan alert “in development”; tombol kembali ke profile |
| `/counter` | Publik | Halaman percobaan counter dan API karakter, bukan fitur dompet |

`src/pages/HistoryTransaction.js` hanya placeholder dan tidak memiliki route. `Example.js` juga tidak dipasang ke route aktif. Tidak ada wildcard 404.

Alur utama saat ini:

- Daftar → login → dashboard → jika PIN belum ada, buat PIN → dashboard.
- Dashboard / menu Transfer → cari penerima → nominal → konfirmasi → modal PIN → status.
- Profil → informasi personal → kelola nomor → tambah nomor.
- Lupa password → confirm-email → reset-password → login.

## Temuan yang memengaruhi desain dan navigasi

| Prioritas | Bukti source | Temuan dan dampak | Perbaikan yang disarankan |
| --- | --- | --- | --- |
| P0 | `src/component/Modal.js`, `src/redux/asyncActions/transfer.js` | Navigasi sukses terjadi segera setelah dispatch, sebelum hasil API. Error API dikembalikan sebagai payload biasa. UI bisa mengumumkan transfer berhasil padahal gagal. | Tampilkan processing; thunk gunakan rejectWithValue atau kontrak error eksplisit; tunggu hasil valid sebelum menuju hasil. `.unwrap()` saja belum cukup selama error ditelan sebagai fulfilled. |
| P0 | `src/redux/asyncActions/user.js`, `src/redux/reducers/user.js`, `src/redux/reducers/index.js`, `src/component/Modal.js` | PIN dari respons login masuk ke state user yang dipersist dan dibandingkan di browser. Ini juga menentukan navigasi gagal. | Verifikasi PIN di server. Frontend cukup menerima status `hasPin`; jangan persist PIN. Kontrak backend perlu diperiksa sebelum implementasi. |
| P1 | `src/component/PrivateRoute.js`, `src/pages/Dashboard.js` | Guard hanya memeriksa token; pemeriksaan PIN hanya di dashboard. Route lain dapat dibuka langsung tanpa melewati onboarding. | Auth layout dan onboarding guard bersama; simpan tujuan semula dan gunakan redirect replace. |
| P1 | `src/pages/InputAmount.js`, `src/pages/Confirmation.js`, reducer transfer | Penerima dan nominal hanya pada state transfer yang tidak dipersist. Refresh/direct URL bisa kehilangan konteks; tidak ada guard langkah. | ID penerima dalam URL; validasi draft pada tiap langkah. Draft tanpa konteks kembali ke pilih penerima; data hasil diambil melalui ID transaksi dan otorisasi server. |
| P1 | `src/component/Sidebar.js`, reducer sidebar | Menu aktif ditentukan state Redux, bukan lokasi URL. Masuk lewat tombol dashboard/deep link/Back tidak selalu memperbaruinya. Heading onClick tidak menyediakan perilaku link native. | Satu konfigurasi navigasi dengan NavLink; seluruh baris menu dapat diklik, aktif mengikuti route induk. |
| P1 | `src/component/Dropdown.js`, `src/pages/InputAmount.js`, `Confirmation.js`, `StatusSuccess.js`, `StatusFailed.js` | Navigasi mobile berulang dan berbeda; StatusFailed masih memakai link `facebook.com`. | Satu komponen navigasi desktop/mobile, sumber menu sama. |
| P1 | `src/pages/HistoryTransaction.js`, `src/App.js` | Riwayat lengkap tidak tersedia walaupun API history sudah ada. | Menu Aktivitas dan route history dengan pagination; filter yang tidak didukung API perlu implementasi tambahan. |
| P1 | `src/pages/TopUp.js` | Kembali ke dashboard sebelum hasil isi saldo diketahui; instruksi menyebut virtual account tanpa alur penerbitan VA di source halaman. | Processing/success/error berdasarkan respons. Jangan tampilkan nomor VA atau pilihan bank sebelum backend mendukung. |
| P2 | `src/pages/StatusSuccess.js`, `StatusFailed.js` | Detail hasil hardcoded, merek Rewallet/Zwallet bercampur; tombol PDF/share belum memiliki handler. | Satu layar hasil berbasis data transaksi; tampilkan ID, waktu, status, penerima, nominal dan catatan. Tambahkan export hanya setelah tersedia. |
| P2 | `src/pages/ManagePhoneNumber.js` | Ikon hapus berarti pindah ke form nomor baru, bukan menghapus. | Ubah label menjadi “Ubah nomor”; jangan tampilkan aksi hapus palsu. |
| P2 | `src/pages/Dashboard.js` | Grafik berupa gambar, angka pemasukan/pengeluaran hardcoded. | Hitung dari data riil dengan periode jelas; loading/empty/error saat data belum tersedia. |
| P2 | `src/App.js`, README | Tidak ada 404; route eksperimen publik; README menyebut backend. | Tambah 404, keluarkan halaman percobaan dari produk, perbarui dokumentasi. |

Pemeriksaan recovery menemukan alur berbasis ID Redux, bukan token reset dari URL. Backend tidak diaudit, sehingga keamanan validasi email/reset tidak dapat disimpulkan dari frontend saja.

## Arah visual: Calm Money

Desain dompet yang tenang, bersih, dan mudah dibaca. Saldo serta tindakan utama paling menonjol; informasi pendukung berada di lapisan kedua. Bahasa antarmuka Indonesia, mata uang IDR, dan waktu Asia/Jakarta. Merek konsisten `rewallet.`.

| Elemen | Spesifikasi |
| --- | --- |
| Latar | Off-white `#F5F7F3` |
| Permukaan | Putih `#FFFFFF`, batas `#E1E7DF` |
| Teks utama | Hijau gelap `#152D27` |
| Teks pendukung | `#60726A` |
| Warna utama | Forest green `#18634A` |
| Aksen | Lime `#D9F48B`, terutama CTA di kartu saldo |
| Error | `#A63636`, disertai pesan tertulis |
| Tipografi | System sans; angka tabular; judul 27–32 px, nominal 35–43 px; body 13–16 px |
| Spasi dan bentuk | Unit 4/8 px, panel 21–29 px, sudut panel 16–18 px, tombol 9 px |
| Desktop | Sidebar sekitar 226 px; konten maksimum 1450 px; dua kolom pada ringkasan |
| Tablet/mobile | Navigasi bawah dengan lima tujuan; satu kolom di ≤650 px; label tetap terlihat |
| Aksesibilitas | Native links/buttons, fokus jelas, label input, state aktif dengan aria-current, status tertulis, target sentuh minimal sekitar 44 px |

Grafik prototipe sengaja diberi label ilustrasi. Pada produksi, gunakan agregat backend dan chart dengan sumbu, periode serta detail nilai yang dapat diakses; bila belum ada sumber data, hilangkan grafik daripada menyajikan angka contoh sebagai data pengguna.

## Arsitektur navigasi usulan

Lima tujuan utama sama di desktop/mobile: **Ringkasan, Transfer, Isi saldo, Aktivitas, Profil**. Isi saldo tetap menjadi tujuan tersendiri karena merupakan fitur utama yang sudah ada. Logout berada di area Profil/menu akun pada implementasi akhir, bukan satu tab utama. Navigasi global tetap hadir sepanjang alur; draft menyimpan nominal/catatan jika pengguna kembali satu langkah.

Struktur usulan untuk implementasi React:

```text
PublicLayout
  /                         Landing
  /login                    Masuk
  /sign-up                  Daftar
  /forgot-password          Minta pemulihan
  /reset-password/:token    Password baru, setelah backend mendukung token
OnboardingLayout + auth
  /onboarding/pin           Buat PIN
AppLayout + auth + hasPin
  /dashboard                Ringkasan
  /transfer                 Pilih penerima
  /transfer/:recipientId/amount
  /transfer/:recipientId/review
  /transactions/:transactionId  Hasil/detail dari server
  /top-up                   Isi saldo
  /activity                 Riwayat
  /profile                  Profil
  /profile/personal         Informasi personal
  /profile/phone            Ubah nomor
  /profile/password         Ganti password
  /profile/pin              Ganti PIN
*                           Halaman tidak ditemukan
```

Ini spesifikasi route usulan, belum merupakan perubahan App.js. Prototipe memakai `#/transfer/amount`, `#/transfer/confirm`, dan `#/transfer/result` untuk demonstrasi lokal; aplikasi produksi memakai ID yang ditunjukkan di atas.

| URL lama | Tujuan baru |
| --- | --- |
| `/search-receiver` | `/transfer` |
| `/input-amount` | `/transfer/:recipientId/amount` jika draft valid, jika tidak `/transfer` |
| `/confirmation` | `/transfer/:recipientId/review` jika draft valid, jika tidak `/transfer` |
| `/status-success`, `/status-failed` | `/transactions/:transactionId` jika ada ID; selain itu `/activity` |
| `/personal-information` | `/profile/personal` |
| `/manage-phone-number`, `/add-phone-number` | `/profile/phone` |
| `/change-password` | `/profile/password` |
| `/change-pin` | `/profile/pin` |
| `/create-pin` | `/onboarding/pin` |
| `/create-pin-success` | `/dashboard` setelah verifikasi onboarding; selain itu `/onboarding/pin` |
| `/confirm-email` | `/forgot-password` |
| `/reset-password` | `/forgot-password` bila konteks reset tidak valid |

Pertahankan redirect alias selama migrasi agar bookmark tidak rusak. Guard tidak boleh mempercayai recipientId/transactionId begitu saja: otorisasi dan validasi tetap di server. Auth guest-only untuk login/signup; recovery mengikuti validitas token server.

## Susunan setiap layar

- **Ringkasan:** sapaan, saldo yang dapat disembunyikan, Transfer/Isi saldo, arus uang berbasis data, penerima yang pernah dipilih bila tersedia, tiga aktivitas terbaru dengan “Lihat semua”. Jangan mengasumsikan API frequent contacts sudah ada.
- **Transfer:** pencarian nama/nomor, hasil jelas, nama dan nomor sebelum pilih; pagination API tetap dipertahankan. Tiga langkah: Penerima → Nominal → Konfirmasi. Nominal/catatan dapat diedit kembali tanpa hilang.
- **Konfirmasi:** identitas penerima, nominal, sisa saldo, catatan; PIN ditanyakan setelah pengguna meninjau. Form PIN produksi harus masked, mendukung paste/autofill sesuai platform, error tetap di langkah yang sama. PIN salah bukan bukti transfer sudah gagal di server.
- **Hasil:** status dari server, ID transaksi dan waktu aktual; tombol Aktivitas dan Ringkasan. Kegagalan pasti menampilkan alasan dan edit/coba lagi. Timeout atau status belum pasti membuka pemeriksaan status; jangan langsung mengirim ulang.
- **Isi saldo:** nominal, preset yang dapat diedit, ringkasan, processing/result. Bank/VA hanya setelah kontrak pembayaran tersedia. Prototipe meniru nominal langsung dari repo, bukan integrasi payment gateway.
- **Aktivitas:** daftar kronologis, kategori, status, nominal dengan tanda masuk/keluar, pagination. Penentuan arah transaksi perlu field sender/recipient/tipe yang benar, bukan asumsi semua transfer merupakan pengeluaran. Detail memakai ID transaksi.
- **Profil:** identitas dan pengaturan personal/nomor/password/PIN. Ubah nomor diberi label literal. Foto memakai upload + preview + loading + pesan hasil setelah respons; form sensitif tidak disimpan ke draft.
- **Landing:** hero ringkas tentang kirim uang dan pantau transaksi, visual produk asli, tombol Daftar/Masuk. Hindari klaim keamanan, jumlah pengguna, atau bank mitra yang belum terverifikasi.
- **Auth:** satu layout konsisten; form yang fokus, label terlihat, show/hide password, error inline, loading, link recovery. Register → login mengikuti perilaku repo; onboarding PIN setelah login.
- **Recovery:** permintaan email → respons netral → buka tautan reset yang valid → password baru → login; perubahan flow ini memerlukan dukungan backend.

## State dan aturan interaksi untuk implementasi

| Situasi | Perilaku |
| --- | --- |
| Loading profil/saldo | Skeleton, jangan menampilkan `RpNaN` atau saldo nol palsu |
| Belum ada transaksi | Pesan kosong dan tautan Isi saldo / Transfer |
| Tidak ada hasil penerima | Pesan dan pencarian baru; input tetap ada |
| Nominal tidak valid | Error di bawah nominal; sesuai batas repo Rp10.000–Rp5.000.000 dan saldo, divalidasi ulang server |
| Permintaan transfer dikirim | Tombol nonaktif, teks processing, hindari klik ganda; idempotency key memerlukan backend |
| API menolak transaksi | Alasan yang aman ditampilkan; draft tidak hilang |
| Timeout/status belum pasti | “Sedang memeriksa status”; verifikasi transaksi sebelum retry |
| PIN salah | Error inline, pertahankan penerima/nominal; pembatasan percobaan di server |
| Token tidak valid | Hapus sesi/draft sensitif, redirect login dengan returnTo yang aman |
| Refresh di tengah transfer | Validasi/rebuild penerima; bila draft hilang kembali ke transfer dengan pesan |
| Akses hasil langsung | Fetch detail dengan ID dan token; not found/forbidden sesuai respons |
| URL tidak ditemukan | 404 dengan tombol Ringkasan |

## Langkah implementasi yang disarankan

1. Shared layouts dan satu konfigurasi NavLink; route guard, 404, alias URL lama.
2. Perbaiki kontrak error/success transfer dan topup, hasil berbasis transaksi, dan verifikasi PIN di server. Jangan menutupi masalah state dengan redesign visual.
3. Implementasikan tokens/komponen baru terisolasi: Button, Field, AmountInput, RecipientRow, TransactionRow, StatusNotice, TransferStepper. Migrasikan halaman per alur agar CSS global lama tidak bocor.
4. Ringkasan → Transfer → Hasil → Aktivitas → Isi saldo → Profil → Auth/recovery.
5. Hapus import CSS/JS Bootstrap dari `src/index.js` dan dependency react-bootstrap/bootstrap hanya setelah seluruh komponen lama selesai diganti.

## Batas verifikasi

JavaScript lolos pemeriksaan sintaks Node. Pengujian DOM dengan jsdom berhasil untuk 12 state route, navigasi, pencarian kosong, nominal, transfer simulasi dan hasil, perubahan saldo, isi saldo, filter, sembunyikan saldo, edit profil, validasi konfirmasi password, serta escaping input. Tidak ada error runtime pada pengujian tersebut.

Pemeriksaan visual dan overflow pada browser belum berhasil dilakukan: executable browser tidak tersedia dan unduhan browser gagal. Breakpoint desktop/mobile sudah ditulis, tetapi layout responsif belum diverifikasi secara visual. Ini tidak membuktikan login, API pembayaran, atau keamanan backend berjalan. Source aplikasi belum diubah dan build React lama belum dijalankan karena deliverable tahap ini adalah audit dan rancangan yang dapat ditinjau.
