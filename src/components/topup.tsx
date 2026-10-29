"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, TextField } from "@mui/material";
import { api, RequestError } from "@/lib/client";
import { amountValue } from "@/lib/validation";
import { money } from "@/lib/format";
import type { Transaction } from "@/lib/types";
import { useWallet } from "./wallet-shell";
import { Icon, LinkButton, PageHead, Panel } from "./ui";
export default function Topup() {
  const { profile, demo, refresh } = useWallet(),
    router = useRouter();
  const [amount, setAmount] = useState("100000"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [uncertain, setUncertain] = useState(false);
  const intent = useRef({ key: "", amount: 0 }),
    locked = useRef(false);
  const n = Number(amount);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (locked.current || uncertain) return;
    setError("");
    try {
      amountValue(amount);
    } catch (e) {
      setError((e as Error).message);
      return;
    }
    locked.current = true;
    setBusy(true);
    if (!intent.current.key || intent.current.amount !== n)
      intent.current = { key: crypto.randomUUID(), amount: n };
    try {
      const t = await api<Transaction>("topup", "POST", {
        amount: n,
        key: intent.current.key,
      });
      await refresh();
      router.push("/transactions/" + encodeURIComponent(t.id));
    } catch (e) {
      setError((e as Error).message);
      if (e instanceof RequestError && e.code === "UNCERTAIN")
        setUncertain(true);
    } finally {
      setBusy(false);
      locked.current = false;
    }
  }
  return (
    <>
      <PageHead
        title="Tambah ruang untuk rencanamu."
        subtitle="Tentukan nominal isi saldo yang kamu butuhkan."
        eyebrow="ISI SALDO"
      />
      <div className="topup-layout">
        <Panel>
          <h2 className="mb-7">Nominal isi saldo</h2>
          <form className="form-stack" onSubmit={submit}>
            <TextField
              label="Nominal isi saldo (Rp)"
              className="amount-field"
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={busy || uncertain}
              slotProps={{
                htmlInput: {
                  min: 10000,
                  max: 5000000,
                  step: 1,
                  inputMode: "numeric",
                },
              }}
            />
            <div className="preset-grid">
              {[50000, 100000, 200000, 500000, 1000000, 2000000].map(
                (value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={n === value ? "contained" : "outlined"}
                    onClick={() => setAmount(String(value))}
                    disabled={busy || uncertain}
                  >
                    {money(value)}
                  </Button>
                ),
              )}
            </div>
            <p className="field-help">
              Minimum Rp10.000 · maksimum Rp5.000.000. Kamu bisa mengubah
              nominal sesuai kebutuhan.
            </p>
            {demo && (
              <Alert severity="info">
                Ini simulasi isi saldo. Tidak ada pembayaran atau uang nyata
                yang berpindah.
              </Alert>
            )}
            {error && (
              <Alert severity={uncertain ? "warning" : "error"}>{error}</Alert>
            )}
            {uncertain ? (
              <LinkButton variant="contained" href="/activity">
                Periksa status di Aktivitas
              </LinkButton>
            ) : (
              <Button
                variant="contained"
                type="submit"
                disabled={busy}
                startIcon={<Icon name="topup" />}
              >
                {busy
                  ? "Memproses…"
                  : demo
                    ? "Simulasikan isi saldo"
                    : "Lanjutkan isi saldo"}
              </Button>
            )}
          </form>
        </Panel>
        <div className="stack">
          <Panel>
            <h2 className="mb-4">Ringkasan</h2>
            <div className="detail-row">
              <span>Saldo saat ini</span>
              <strong>{money(profile?.balance)}</strong>
            </div>
            <div className="detail-row">
              <span>Nominal isi saldo</span>
              <strong>{Number.isFinite(n) ? money(n) : "—"}</strong>
            </div>
            {demo && (
              <div className="detail-row">
                <span>Saldo setelah simulasi</span>
                <strong>
                  {profile?.balance != null && Number.isFinite(n)
                    ? money(profile.balance + n)
                    : "—"}
                </strong>
              </div>
            )}
          </Panel>
          <aside className="tip">
            <h3>Sesuai kebutuhanmu.</h3>Periksa nominal sebelum melanjutkan.
            Status isi saldo akan tampil setelah layanan memberikan konfirmasi.
          </aside>
        </div>
      </div>
    </>
  );
}
