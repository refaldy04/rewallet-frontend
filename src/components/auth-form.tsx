"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Button, InputAdornment, TextField } from "@mui/material";
import { api } from "@/lib/client";
import { safeReturnTo } from "@/lib/validation";
import { Brand, Icon } from "./ui";
type Mode = "login" | "register" | "recovery" | "reset";

export function SecretField({
  label,
  name,
  pin = false,
  autoComplete = "new-password",
  value,
  onChange,
}: {
  label: string;
  name: string;
  pin?: boolean;
  autoComplete?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [show, setShow] = useState(false);

  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      type={show ? "text" : "password"}
      required
      autoComplete={autoComplete}
      slotProps={{
        htmlInput: {
          minLength: pin ? 6 : 8,
          maxLength: pin ? 6 : 128,
          inputMode: pin ? "numeric" : undefined,
          pattern: pin ? "[0-9]{6}" : undefined,
        },
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <button
                type="button"
                className="secret-toggle"
                onClick={() => setShow((v) => !v)}
                aria-label={
                  (show ? "Sembunyikan " : "Tampilkan ") + label.toLowerCase()
                }
                aria-pressed={show}
              >
                <Icon name={show ? "hide" : "show"} />
              </button>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

const copy = {
  login: [
    "SENANG BERTEMU LAGI",
    "Selamat datang kembali.",
    "Masuk untuk melanjutkan langkah kecil menuju dompet yang lebih teratur.",
    "Masuk",
  ],
  register: [
    "MULAI LANGKAH PERTAMA",
    "Ruang baru untuk uangmu.",
    "Buat akun rewallet dan kelola kebutuhan dompetmu di satu tempat.",
    "Buat akun",
  ],
  recovery: [
    "PEMULIHAN AKUN",
    "Lupa password?",
    "Masukkan email akunmu. Kami akan mengirim tautan pemulihan jika email tersebut terdaftar.",
    "Kirim tautan pemulihan",
  ],
  reset: [
    "PEMULIHAN AKUN",
    "Buat password baru.",
    "Gunakan password yang belum pernah kamu gunakan untuk akun ini.",
    "Simpan password",
  ],
};

export default function AuthForm({
  mode,
  demoEnabled = false,
  connected = false,
  token,
}: {
  mode: Mode;
  demoEnabled?: boolean;
  connected?: boolean;
  token?: string;
}) {
  const router = useRouter(),
    search = useSearchParams();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const [eyebrow, title, description, submit] = copy[mode];
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    if (mode === "reset" && form.get("password") !== form.get("confirm")) {
      setError("Konfirmasi password belum sama.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await api<{ hasPin?: boolean; message?: string }>(
        "auth/" + mode,
        "POST",
        {
          username: form.get("username"),
          email: form.get("email"),
          password: form.get("password"),
          token,
        },
      );
      if (mode === "login") {
        sessionStorage.removeItem("rewallet-draft");
        router.replace(
          result.hasPin
            ? safeReturnTo(search.get("returnTo"))
            : "/onboarding/pin",
        );
        router.refresh();
      } else if (mode === "register" || mode === "reset")
        router.replace(
          "/login?notice=" + (mode === "register" ? "registered" : "reset"),
        );
      else setMessage(result.message ?? "Periksa kotak masuk emailmu.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function openDemo() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await api("auth/demo", "POST", {});
      sessionStorage.removeItem("rewallet-draft");
      router.replace(safeReturnTo(search.get("returnTo")));
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <div className="auth-form">
      <div className="auth-mobile-brand">
        <Brand />
      </div>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
      {search.get("notice") === "registered" && (
        <Alert severity="success" className="mb-6">
          Akun berhasil dibuat. Silakan masuk.
        </Alert>
      )}
      {search.get("notice") === "reset" && (
        <Alert severity="success" className="mb-6">
          Password berhasil diperbarui. Silakan masuk.
        </Alert>
      )}
      {!connected && (
        <Alert severity="info" className="mb-6">
          Layanan akun belum terhubung.
          {demoEnabled
            ? " Coba tampilan dan alurnya melalui akun demo di bawah."
            : " Silakan kembali setelah layanan tersedia."}
        </Alert>
      )}
      <form className="form-stack" onSubmit={handleSubmit}>
        {mode === "register" && (
          <TextField
            label="Username"
            name="username"
            required
            autoComplete="username"
            slotProps={{ htmlInput: { minLength: 4, maxLength: 32 } }}
          />
        )}
        {mode !== "reset" && (
          <TextField
            label="Alamat email"
            name="email"
            type="email"
            required
            autoComplete="email"
            slotProps={{ htmlInput: { maxLength: 254 } }}
          />
        )}
        {mode !== "recovery" && (
          <SecretField
            label={mode === "reset" ? "Password baru" : "Password"}
            name="password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
        )}
        {mode === "reset" && (
          <SecretField label="Konfirmasi password baru" name="confirm" />
        )}
        {mode === "login" && (
          <div className="text-right -mt-2">
            <Link className="text-link" href="/forgot-password">
              Lupa password?
            </Link>
          </div>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}
        <Button
          variant="contained"
          type="submit"
          fullWidth
          disabled={busy || !connected}
          startIcon={
            busy ? undefined : (
              <Icon name={mode === "recovery" ? "mail" : "next"} />
            )
          }
        >
          {busy ? "Memproses…" : submit}
        </Button>
      </form>
      {(mode === "login" || mode === "register") && (
        <p className="auth-switch">
          {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
          <Link href={mode === "login" ? "/sign-up" : "/login"}>
            {mode === "login" ? "Daftar di sini" : "Masuk di sini"}
          </Link>
        </p>
      )}
      {(mode === "recovery" || mode === "reset") && (
        <p className="auth-switch">
          <Link href="/login">← Kembali ke halaman masuk</Link>
        </p>
      )}
      {demoEnabled && (mode === "login" || mode === "register") && (
        <>
          <div className="auth-divider">KENALI DULU REWALLET</div>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => void openDemo()}
            disabled={busy}
          >
            Coba akun demo <Icon name="next" className="ml-2" />
          </Button>
          <p className="demo-help">
            Data contoh, tanpa uang nyata.
            <br />
            PIN demo: <strong>123456</strong> · password demo:{" "}
            <strong>Demo12345!</strong>
          </p>
        </>
      )}
    </div>
  );
}
