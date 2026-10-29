"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { api } from "@/lib/client";
import { useWallet } from "./wallet-shell";
import { Icon, LinkButton, Loading, PageHead, Panel, PersonAvatar } from "./ui";
import { SecretField } from "./auth-form";
export default function ProfileHome() {
  const { profile, demo, refresh } = useWallet(),
    router = useRouter();
  const [preview, setPreview] = useState(""),
    [file, setFile] = useState<File | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [logout, setLogout] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  async function upload() {
    if (!file || busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const form = new FormData();
      form.set("picture", file);
      const result = await api<{ message: string }>(
        "profile/picture",
        "POST",
        form,
      );
      await refresh();
      setMessage(result.message);
      setFile(null);
      setPreview("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function signOut() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await api("auth/logout", "POST", {});
      sessionStorage.removeItem("rewallet-draft");
      router.replace("/login");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
      setLogout(false);
    }
  }
  const settings = [
    {
      href: "/profile/personal",
      icon: "profile" as const,
      title: "Informasi personal",
      text: "Nama, username, dan email akun",
    },
    {
      href: "/profile/phone",
      icon: "phone" as const,
      title: "Ubah nomor telepon",
      text: "Kelola nomor yang terhubung ke akun",
    },
    {
      href: "/profile/password",
      icon: "lock" as const,
      title: "Ganti password",
      text: "Perbarui password untuk masuk",
    },
    {
      href: "/profile/pin",
      icon: "shield" as const,
      title: "Ganti PIN",
      text: "Perbarui PIN untuk konfirmasi transaksi",
    },
  ];
  return (
    <>
      <PageHead
        title="Akunmu, dalam kendalimu."
        subtitle="Kelola informasi dan pengaturan dompet personalmu."
        eyebrow="PROFIL"
      />
      <div className="narrow">
        <Panel>
          {!profile ? (
            <Loading />
          ) : (
            <>
              <div className="profile-card">
                <PersonAvatar
                  name={profile.name}
                  src={preview || profile.picture}
                  size={74}
                />
                <div>
                  <h2>{profile.name}</h2>
                  <p>{profile.email || "Email belum tersedia"}</p>
                  <button
                    className="text-link"
                    disabled={busy}
                    onClick={() => input.current?.click()}
                  >
                    <Icon name="edit" /> Ubah foto
                  </button>
                </div>
                <input
                  ref={input}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  aria-label="Pilih foto profil"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setError("");
                    setMessage("");
                    if (f) {
                      if (
                        f.size > 2_000_000 ||
                        !["image/jpeg", "image/png", "image/webp"].includes(
                          f.type,
                        )
                      )
                        setError("Pilih JPG, PNG, atau WebP maksimal 2 MB.");
                      else {
                        setFile(f);
                        setPreview(URL.createObjectURL(f));
                      }
                    }
                    e.target.value = "";
                  }}
                />
              </div>
              {file && (
                <div className="flex gap-3 mb-6">
                  <Button
                    variant="contained"
                    disabled={busy}
                    onClick={() => void upload()}
                  >
                    {busy ? "Mengunggah…" : "Simpan foto"}
                  </Button>
                  <Button
                    disabled={busy}
                    onClick={() => {
                      setFile(null);
                      setPreview("");
                    }}
                  >
                    Batal
                  </Button>
                </div>
              )}
              {demo && (
                <Alert severity="info" className="mb-6">
                  Akun demo. Perubahan berlaku selama sesi ini. PIN awal 123456
                  · password awal Demo12345!
                </Alert>
              )}
              {message && (
                <Alert severity="success" className="mb-5">
                  {message}
                </Alert>
              )}
              {error && (
                <Alert severity="error" className="mb-5">
                  {error}
                </Alert>
              )}
              {settings.map((s) => (
                <Link key={s.href} href={s.href} className="settings-link">
                  <Icon name={s.icon} />
                  <div>
                    <h3>{s.title}</h3>
                    <small>{s.text}</small>
                  </div>
                  <Icon name="next" />
                </Link>
              ))}
              <Button
                color="error"
                className="mt-6"
                startIcon={<Icon name="logout" />}
                onClick={() => setLogout(true)}
                disabled={busy}
              >
                Keluar dari akun
              </Button>
            </>
          )}
        </Panel>
      </div>
      <Dialog
        open={logout}
        onClose={() => !busy && setLogout(false)}
        aria-labelledby="logout-title"
      >
        <DialogTitle id="logout-title">Keluar dari akun?</DialogTitle>
        <DialogContent>
          <p className="subtitle">
            {demo
              ? "Data simulasi akan dihapus ketika kamu keluar."
              : "Kamu dapat masuk kembali kapan saja."}
          </p>
        </DialogContent>
        <DialogActions>
          <Button disabled={busy} onClick={() => setLogout(false)}>
            Batal
          </Button>
          <Button color="error" onClick={() => void signOut()} disabled={busy}>
            {busy ? "Memproses…" : "Keluar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export function ProfileForm({
  kind,
}: {
  kind: "personal" | "phone" | "password" | "pin";
}) {
  const { profile, refresh } = useWallet();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const locked = useRef(false);
  const copy = {
    personal: [
      "Informasi personal.",
      "Perbarui namamu dan lihat informasi akun.",
    ],
    phone: ["Ubah nomor telepon.", "Gunakan nomor aktif yang dapat dihubungi."],
    password: [
      "Ganti password.",
      "Masukkan password saat ini, lalu buat password baru.",
    ],
    pin: ["Ganti PIN.", "Gunakan enam angka untuk konfirmasi transaksi."],
  }[kind];
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (locked.current) return;
    const formElement = e.currentTarget,
      form = new FormData(formElement);
    setError("");
    setMessage("");
    if (
      (kind === "password" || kind === "pin") &&
      form.get("next") !== form.get("confirm")
    ) {
      setError("Isian baru dan konfirmasi belum sama.");
      return;
    }
    locked.current = true;
    setBusy(true);
    try {
      const path = kind === "personal" ? "profile" : "profile/" + kind;
      const result = await api<{ message?: string }>(path, "PATCH", {
        name: form.get("name"),
        phone: form.get("phone"),
        current: form.get("current"),
        next: form.get("next"),
      });
      await refresh();
      setMessage(result.message ?? "Informasi personal berhasil diperbarui.");
      if (kind === "password" || kind === "pin") formElement.reset();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  return (
    <>
      <PageHead
        title={copy[0]}
        subtitle={copy[1]}
        eyebrow="PENGATURAN PROFIL"
      />
      <div className="narrow">
        <Panel>
          {!profile ? (
            <Loading />
          ) : (
            <form className="form-stack" onSubmit={submit}>
              {kind === "personal" ? (
                <>
                  <TextField
                    label="Nama lengkap"
                    name="name"
                    required
                    defaultValue={profile.name}
                    slotProps={{ htmlInput: { minLength: 2, maxLength: 80 } }}
                  />
                  <TextField
                    label="Username"
                    value={profile.username}
                    slotProps={{ input: { readOnly: true } }}
                    helperText="Username akun tidak dapat diubah di sini."
                  />
                  <TextField
                    label="Alamat email"
                    value={profile.email}
                    slotProps={{ input: { readOnly: true } }}
                  />
                  <div className="detail-row">
                    <span>Nomor telepon</span>
                    <strong>
                      {profile.phone || "Belum ditambahkan"}
                      <br />
                      <Link href="/profile/phone" className="text-link">
                        Ubah nomor
                      </Link>
                    </strong>
                  </div>
                </>
              ) : kind === "phone" ? (
                <>
                  <div className="detail-row">
                    <span>Nomor saat ini</span>
                    <strong>{profile.phone || "Belum ditambahkan"}</strong>
                  </div>
                  <TextField
                    label="Nomor telepon baru"
                    name="phone"
                    type="tel"
                    defaultValue={profile.phone.replace(/\s/g, "")}
                    required
                    autoComplete="tel"
                    helperText="Contoh: 081234567890, tanpa spasi."
                    slotProps={{
                      htmlInput: {
                        pattern: "(\\+62|08|62)[0-9]{8,13}",
                        maxLength: 16,
                      },
                    }}
                  />
                </>
              ) : (
                <>
                  <SecretField
                    label={
                      kind === "pin" ? "PIN saat ini" : "Password saat ini"
                    }
                    name="current"
                    pin={kind === "pin"}
                    autoComplete={kind === "pin" ? "off" : "current-password"}
                  />
                  <SecretField
                    label={kind === "pin" ? "PIN baru" : "Password baru"}
                    name="next"
                    pin={kind === "pin"}
                  />
                  <SecretField
                    label={
                      kind === "pin"
                        ? "Konfirmasi PIN baru"
                        : "Konfirmasi password baru"
                    }
                    name="confirm"
                    pin={kind === "pin"}
                  />
                  <p className="field-help">
                    {kind === "pin"
                      ? "PIN harus terdiri dari 6 angka."
                      : "Password minimal 8 karakter dan berbeda dari password saat ini."}
                  </p>
                </>
              )}
              {error && <Alert severity="error">{error}</Alert>}
              {message && <Alert severity="success">{message}</Alert>}
              <div className="form-end">
                <Link className="text-link" href="/profile">
                  ← Kembali ke profil
                </Link>
                <Button variant="contained" type="submit" disabled={busy}>
                  {busy ? "Menyimpan…" : "Simpan perubahan"}
                </Button>
              </div>
            </form>
          )}
        </Panel>
      </div>
    </>
  );
}
export function OnboardingPin() {
  const router = useRouter();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = new FormData(e.currentTarget);
    if (form.get("pin") !== form.get("confirm")) {
      setError("Konfirmasi PIN belum sama.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api("onboarding/pin", "POST", { pin: form.get("pin") });
      router.replace("/dashboard");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <div className="auth-form">
      <p className="eyebrow">SATU LANGKAH LAGI</p>
      <h1>Buat PIN dompetmu.</h1>
      <p>
        PIN digunakan untuk mengonfirmasi transaksi. Jangan bagikan enam angka
        ini kepada siapa pun.
      </p>
      <form className="form-stack" onSubmit={submit}>
        <SecretField label="PIN baru" name="pin" pin />
        <SecretField label="Konfirmasi PIN" name="confirm" pin />
        {error && <Alert severity="error">{error}</Alert>}
        <Button variant="contained" type="submit" disabled={busy}>
          {busy ? "Menyimpan…" : "Simpan PIN dan lanjutkan"}
        </Button>
      </form>
      <p className="auth-switch">
        <LinkButton
          href="/login"
          onClick={async (e) => {
            e.preventDefault();
            try {
              await api("auth/logout", "POST", {});
              router.replace("/login");
              router.refresh();
            } catch (error) {
              setError((error as Error).message);
            }
          }}
        >
          Keluar dari akun
        </LinkButton>
      </p>
    </div>
  );
}
