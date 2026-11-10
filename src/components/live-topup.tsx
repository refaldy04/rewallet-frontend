"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, MenuItem, TextField } from "@mui/material";
import { api, RequestError } from "@/lib/client";
import { money } from "@/lib/format";
import { readTopupIntent, topupAmountValue } from "@/lib/topup";
import { useRemote } from "@/lib/use-remote";
import type { TopupIntent, TopupMethod, TopupPayment } from "@/lib/types";
import { useWallet } from "./wallet-shell";
import { ErrorNotice, Icon, Loading, PageHead, Panel } from "./ui";
import TopupStatus from "./topup-status";

export default function LiveTopup({
  userId,
  topupId,
}: {
  userId?: string;
  topupId?: string;
}) {
  const router = useRouter(),
    { profile } = useWallet();
  const methods = useRemote<TopupMethod[]>(topupId ? null : "topup/methods");
  const [amount, setAmount] = useState("100000"),
    [channel, setChannel] = useState("");
  const [intent, setIntent] = useState<TopupIntent | null>(null);
  const [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false);
  const [error, setError] = useState(""),
    [canEdit, setCanEdit] = useState(false);
  const locked = useRef(false);
  const storageKey = `rewallet-topup:${userId}`;
  const paymentId = topupId ?? intent?.id;
  const method = methods.data?.find(
    (m) => m.channelCode === (channel || methods.data?.[0]?.channelCode),
  );

  useEffect(() => {
    async function restore() {
      if (!userId) return;
      try {
        const saved = readTopupIntent(sessionStorage.getItem(storageKey));
        if (saved) {
          setIntent(saved);
          setAmount(String(saved.amount));
          setChannel(saved.channelCode);
          if (!topupId && saved.id)
            router.replace(`/top-up?topup_id=${encodeURIComponent(saved.id)}`);
        }
        setReady(true);
      } catch {
        setError(
          "Aktifkan penyimpanan browser agar permintaan isi saldo dapat dilanjutkan dengan aman.",
        );
      }
    }
    void restore();
  }, [storageKey, userId, topupId, router]);

  const settled = useCallback(
    (id: string) => {
      try {
        const saved = readTopupIntent(sessionStorage.getItem(storageKey));
        if (saved?.id === id) sessionStorage.removeItem(storageKey);
      } catch {
        /* The status page remains usable if browser storage is unavailable. */
      }
    },
    [storageKey],
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (locked.current || !ready || !userId) return;
    let next = intent;
    setError("");
    setCanEdit(false);
    try {
      if (!next) {
        if (!method) throw new Error("Pilih metode pembayaran yang tersedia.");
        next = {
          key: crypto.randomUUID(),
          amount: topupAmountValue(amount, method),
          channelCode: method.channelCode,
        };
        // Persist before sending: a lost response must always reuse the original business payload and key.
        sessionStorage.setItem(storageKey, JSON.stringify(next));
        setIntent(next);
      }
    } catch (e) {
      setError((e as Error).message);
      return;
    }
    locked.current = true;
    setBusy(true);
    try {
      const payment = await api<TopupPayment>("topup", "POST", next);
      const saved = { ...next, id: payment.id };
      setIntent(saved);
      // The URL also preserves the ID when storage becomes unavailable after creation.
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(saved));
      } catch {
        /* Continue to status. */
      }
      router.replace(`/top-up?topup_id=${encodeURIComponent(payment.id)}`);
    } catch (e) {
      setError(
        e instanceof RequestError && e.code === "UNCERTAIN"
          ? "Hasil permintaan belum diterima. Periksa permintaan yang sama di bawah; jangan buat pembayaran baru."
          : (e as Error).message,
      );
      setCanEdit(
        e instanceof RequestError &&
          e.code !== "UNCERTAIN" &&
          [400, 422].includes(e.status),
      );
    } finally {
      setBusy(false);
      locked.current = false;
    }
  }

  if (paymentId) return <TopupStatus id={paymentId} onSettled={settled} />;
  return (
    <>
      <PageHead
        title="Tambah ruang untuk rencanamu."
        subtitle="Pilih nominal dan metode pembayaran untuk mengisi saldo."
        eyebrow="ISI SALDO"
      />
      <div className="topup-layout">
        <Panel>
          <h2 className="mb-7">Nominal dan metode isi saldo</h2>
          {error && (
            <Alert severity={intent ? "warning" : "error"} className="mb-5">
              {error}
            </Alert>
          )}
          {!ready && !error ? (
            <Loading />
          ) : (
            <form className="form-stack" onSubmit={submit}>
              {intent && (
                <Alert severity="info">
                  Ada permintaan isi saldo yang belum selesai. Lanjutkan dengan
                  nominal dan metode yang sama.
                </Alert>
              )}
              <TextField
                label="Nominal isi saldo (Rp)"
                className="amount-field"
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={busy || !!intent || !ready}
                slotProps={{
                  htmlInput: {
                    min: method?.minAmount ?? 1,
                    max: method?.maxAmount,
                    step: 1,
                    inputMode: "numeric",
                  },
                }}
              />
              {methods.loading && !intent ? (
                <Loading />
              ) : methods.error && !intent ? (
                <ErrorNotice message={methods.error} retry={methods.retry} />
              ) : intent ? (
                <p>
                  Metode pembayaran: <strong>{intent.channelCode}</strong>
                </p>
              ) : (
                <TextField
                  select
                  label="Metode pembayaran"
                  value={method?.channelCode ?? ""}
                  onChange={(e) => setChannel(e.target.value)}
                  disabled={busy || !methods.data?.length}
                  required
                >
                  {methods.data?.map((m) => (
                    <MenuItem key={m.channelCode} value={m.channelCode}>
                      {m.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              {method && (
                <p className="field-help">
                  Minimum {money(method.minAmount)} · maksimum{" "}
                  {money(method.maxAmount)}.
                </p>
              )}
              {!methods.loading &&
                !methods.error &&
                !methods.data?.length &&
                !intent && (
                  <Alert severity="info">
                    Belum ada metode pembayaran yang tersedia.
                  </Alert>
                )}
              <div className="preset-grid">
                {[50000, 100000, 200000, 500000, 1000000, 2000000]
                  .filter(
                    (n) =>
                      method && n >= method.minAmount && n <= method.maxAmount,
                  )
                  .map((n) => (
                    <Button
                      key={n}
                      variant={Number(amount) === n ? "contained" : "outlined"}
                      type="button"
                      onClick={() => setAmount(String(n))}
                      disabled={busy || !!intent}
                    >
                      {money(n)}
                    </Button>
                  ))}
              </div>
              <Alert severity="info">
                Saldo bertambah setelah pembayaran dikonfirmasi. Kamu akan
                mendapat tautan pembayaran atau kode QR sesuai metode yang
                dipilih.
              </Alert>
              <Button
                variant="contained"
                type="submit"
                startIcon={<Icon name="topup" />}
                disabled={busy || !ready || (!intent && !method)}
              >
                {busy
                  ? "Memproses…"
                  : intent
                    ? "Periksa permintaan sebelumnya"
                    : "Lanjutkan isi saldo"}
              </Button>
              {canEdit && (
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    try {
                      sessionStorage.removeItem(storageKey);
                      setIntent(null);
                      setError("");
                      setCanEdit(false);
                    } catch {
                      setError("Penyimpanan browser tidak dapat diperbarui.");
                    }
                  }}
                >
                  Ubah nominal atau metode
                </Button>
              )}
            </form>
          )}
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
              <strong>
                {Number.isFinite(Number(amount)) ? money(Number(amount)) : "—"}
              </strong>
            </div>
            <div className="detail-row">
              <span>Metode pembayaran</span>
              <strong>{intent?.channelCode ?? method?.name ?? "—"}</strong>
            </div>
          </Panel>
          <aside className="tip">
            <h3>Sesuai kebutuhanmu.</h3>Periksa nominal dan metode sebelum
            melanjutkan. Status pembayaran akan diperiksa secara berkala.
          </aside>
        </div>
      </div>
    </>
  );
}
