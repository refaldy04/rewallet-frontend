"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert, Button } from "@mui/material";
import { api } from "@/lib/client";
import type { Profile } from "@/lib/types";
import { Brand, Icon, PersonAvatar, type icons } from "./ui";
const navigation: { href: string; label: string; icon: keyof typeof icons }[] =
  [
    { href: "/dashboard", label: "Ringkasan", icon: "dashboard" },
    { href: "/transfer", label: "Transfer", icon: "transfer" },
    { href: "/top-up", label: "Isi saldo", icon: "topup" },
    { href: "/activity", label: "Aktivitas", icon: "activity" },
    { href: "/profile", label: "Profil", icon: "profile" },
  ];
const WalletContext = createContext<{
  profile: Profile | null;
  refresh: () => Promise<void>;
  demo: boolean;
}>({ profile: null, refresh: async () => {}, demo: false });
export const useWallet = () => useContext(WalletContext);
export default function WalletShell({
  children,
  demo,
}: {
  children: React.ReactNode;
  demo: boolean;
}) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null),
    [error, setError] = useState("");
  const refresh = useCallback(async () => {
    try {
      setProfile(await api<Profile>("profile"));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);
  useEffect(() => {
    let active = true;
    api<Profile>("profile").then(
      (p) => {
        if (active) setProfile(p);
      },
      (e) => {
        if (active) setError((e as Error).message);
      },
    );
    return () => {
      active = false;
    };
  }, []);
  const current =
    navigation.find(
      (n) => pathname === n.href || pathname.startsWith(n.href + "/"),
    )?.label ??
    (pathname.startsWith("/transactions") ? "Detail aktivitas" : "Dompet saya");
  const menu = navigation.map((n) => (
    <Link
      key={n.href}
      href={n.href}
      aria-current={
        pathname === n.href || pathname.startsWith(n.href + "/")
          ? "page"
          : undefined
      }
    >
      <Icon name={n.icon} />
      <span>{n.label}</span>
    </Link>
  ));
  return (
    <WalletContext value={{ profile, refresh, demo }}>
      <a href="#main-content" className="skip-link">
        Lewati ke konten
      </a>
      <div className="wallet-shell">
        <aside className="sidebar">
          <Brand />
          <div>
            <p className="side-label">DOMPET SAYA</p>
            <nav aria-label="Navigasi utama">{menu}</nav>
          </div>
          <div className="side-bottom">
            <div className="side-tip">
              <span className="tiny-leaf">✦</span>
              <p>
                Ruang untuk uangmu.
                <br />
                <strong>Dan rencana besarmu.</strong>
              </p>
            </div>
            <p className="side-note">
              Dompet, lebih teratur.
              <br />
              Satu langkah kecil setiap hari.
            </p>
          </div>
        </aside>
        <div className="workspace">
          <header className="topbar">
            <Link href="/" className="mobile-brand">
              rewallet.
            </Link>
            <p className="breadcrumb">
              Dompet saya <span>/</span> {current}
            </p>
            <div className="account-area">
              {demo && (
                <span className="demo-badge">
                  <span />
                  Demo · data contoh
                </span>
              )}
              <Link
                href="/profile"
                className="account-link"
                aria-label="Buka profil"
              >
                <PersonAvatar
                  name={profile?.name ?? "Pengguna"}
                  src={profile?.picture}
                />
                <span className="account-copy">
                  <strong>{profile?.name ?? "Memuat akun…"}</strong>
                  <small>Akun personal</small>
                </span>
                <Icon name="down" />
              </Link>
            </div>
          </header>
          <main id="main-content" className="app-main">
            {error && (
              <div className="mb-6">
                <Alert
                  severity="error"
                  action={
                    <Button color="inherit" onClick={() => void refresh()}>
                      Muat ulang
                    </Button>
                  }
                >
                  {error}
                </Alert>
              </div>
            )}
            {children}
            <footer className="app-footer">
              <span>
                © {new Date().getFullYear()} rewallet. · Dompet, lebih teratur.
              </span>
              <span>
                {demo
                  ? "Simulasi · tanpa transaksi uang nyata"
                  : "Nominal dalam rupiah · waktu WIB"}
              </span>
            </footer>
          </main>
          <nav className="mobile-nav" aria-label="Navigasi utama mobile">
            {menu}
          </nav>
        </div>
      </div>
    </WalletContext>
  );
}
