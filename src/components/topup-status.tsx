"use client";
import { useEffect, useRef, useState } from "react";
import { Alert, Button } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { api, RequestError } from "@/lib/client";
import { dateTime, money } from "@/lib/format";
import { topupFinished, topupIdValue, topupSucceeded } from "@/lib/topup";
import type { TopupPayment } from "@/lib/types";
import { useWallet } from "./wallet-shell";
import { Icon, LinkButton, Loading, PageHead, Panel, StatusPill } from "./ui";

export default function TopupStatus({
  id,
  onSettled,
}: {
  id: string;
  onSettled: (id: string) => void;
}) {
  const [payment, setPayment] = useState<TopupPayment | null>(null);
  const [error, setError] = useState(""),
    [checking, setChecking] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [expired, setExpired] = useState(false);
  const check = useRef<() => void>(() => {});
  const { refresh } = useWallet();

  useEffect(() => {
    let active = true,
      inFlight = false,
      finished = false,
      credited = false,
      attempt = 0;
    let timer: ReturnType<typeof setTimeout>;
    async function load(reconcile = false) {
      if (!active || inFlight || finished) return;
      clearTimeout(timer);
      try {
        topupIdValue(id);
      } catch (e) {
        setError((e as Error).message);
        setInvalid(true);
        return;
      }
      inFlight = true;
      setChecking(true);
      try {
        const next = await api<TopupPayment>(
          `topups/${encodeURIComponent(id)}${reconcile ? "/refresh" : ""}`,
          reconcile ? "POST" : "GET",
          reconcile ? {} : undefined,
        );
        if (!active) return;
        setPayment(next);
        setExpired(
          !!next.expiresAt && Date.parse(next.expiresAt) <= Date.now(),
        );
        setError("");
        finished = topupFinished(next);
        if (finished) onSettled(next.id);
        if (topupSucceeded(next) && !credited) {
          credited = true;
          void refresh();
        }
      } catch (e) {
        if (active)
          setError(
            e instanceof RequestError && e.code === "UNCERTAIN"
              ? "Status pembayaran belum dapat dipastikan. Tunggu pemeriksaan berikutnya atau periksa kembali di halaman ini."
              : (e as Error).message,
          );
      } finally {
        inFlight = false;
        if (active) {
          setChecking(false);
          if (!finished)
            timer = setTimeout(
              () => void load(),
              Math.min(2000 * 2 ** Math.min(attempt++, 4), 30000),
            );
        }
      }
    }
    check.current = () => void load(true);
    void load();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [id, onSettled, refresh]);

  const success = payment && topupSucceeded(payment);
  const failed =
    payment && ["FAILED", "CANCELED", "EXPIRED"].includes(payment.status);
  const finished = payment && topupFinished(payment);
  const actions =
    payment && !finished && !expired && payment.status !== "SUCCEEDED"
      ? payment.actions
      : [];
  return (
    <>
      <PageHead
        title="Status isi saldo."
        subtitle="Lanjutkan pembayaran dan pantau konfirmasi isi saldomu."
        eyebrow="ISI SALDO"
      />
      <div className="narrow">
        <Panel>
          {error && (
            <Alert severity="warning" className="mb-5">
              {error}
            </Alert>
          )}
          {!payment && !error ? (
            <Loading />
          ) : (
            payment && (
              <>
                <div className="result-header" role="status">
                  <span
                    className={`result-icon ${success ? "success" : failed ? "failed" : "pending"}`}
                  >
                    <Icon
                      name={success ? "success" : failed ? "error" : "pending"}
                    />
                  </span>
                  <h2>
                    {success
                      ? "Isi saldo berhasil."
                      : payment.status === "EXPIRED"
                        ? "Pembayaran kedaluwarsa."
                        : failed
                          ? "Pembayaran tidak berhasil."
                          : "Menunggu konfirmasi pembayaran."}
                  </h2>
                  <p>
                    {success
                      ? "Pembayaran sudah dikonfirmasi dan saldo dompetmu diperbarui."
                      : failed
                        ? "Pembayaran ini tidak menambah saldo."
                        : ["CREATED", "UNKNOWN"].includes(payment.status)
                          ? "Permintaan masih diperiksa. Jangan membuat pembayaran baru untuk nominal yang sama."
                          : "Selesaikan pembayaran jika diminta. Saldo bertambah setelah konfirmasi diterima."}
                  </p>
                </div>
                <div className="detail-row">
                  <span>Nominal</span>
                  <strong className="summary-amount">
                    {money(payment.amount)}
                  </strong>
                </div>
                <div className="detail-row">
                  <span>Metode pembayaran</span>
                  <strong>{payment.channelCode}</strong>
                </div>
                <div className="detail-row">
                  <span>Status</span>
                  <StatusPill
                    status={success ? "success" : failed ? "failed" : "pending"}
                  />
                </div>
                <div className="detail-row">
                  <span>ID isi saldo</span>
                  <strong>{payment.id}</strong>
                </div>
                {payment.transactionId && (
                  <div className="detail-row">
                    <span>ID transaksi</span>
                    <strong>{payment.transactionId}</strong>
                  </div>
                )}
                {payment.createdAt && (
                  <div className="detail-row">
                    <span>Dibuat</span>
                    <strong>{dateTime(payment.createdAt)}</strong>
                  </div>
                )}
                {payment.expiresAt && !finished && (
                  <div className="detail-row">
                    <span>Batas pembayaran</span>
                    <strong>{dateTime(payment.expiresAt)}</strong>
                  </div>
                )}
                {success && payment.paidAt && (
                  <div className="detail-row">
                    <span>Dibayar</span>
                    <strong>{dateTime(payment.paidAt)}</strong>
                  </div>
                )}
                {expired && !finished && (
                  <Alert severity="info" className="mt-5">
                    Batas pembayaran sudah lewat. Periksa status untuk
                    memastikan hasilnya.
                  </Alert>
                )}
                {actions.length > 0 && (
                  <div className="form-stack mt-6">
                    {actions.map((action, index) =>
                      action.descriptor === "QR_STRING" ? (
                        <div className="payment-qr" key={index}>
                          <QRCodeSVG
                            value={action.value}
                            size={280}
                            marginSize={4}
                            title="Kode QR pembayaran QRIS"
                          />
                          <p>
                            Pindai kode QR ini menggunakan aplikasi pembayaran
                            yang mendukung QRIS.
                          </p>
                        </div>
                      ) : (
                        <Button
                          key={index}
                          component="a"
                          href={action.value}
                          target={
                            action.descriptor === "WEB_URL"
                              ? "_blank"
                              : undefined
                          }
                          rel="noopener noreferrer"
                          variant="contained"
                        >
                          {action.descriptor === "WEB_URL"
                            ? "Buka halaman pembayaran"
                            : "Buka aplikasi pembayaran"}
                        </Button>
                      ),
                    )}
                  </div>
                )}
              </>
            )
          )}
          <div className="form-end mt-6">
            <LinkButton href="/activity" variant="outlined">
              Lihat aktivitas
            </LinkButton>
            {finished || invalid ? (
              <LinkButton href="/top-up" variant="contained">
                {success ? "Isi saldo lagi" : "Kembali ke isi saldo"}
              </LinkButton>
            ) : (
              <Button
                variant="contained"
                onClick={() => check.current()}
                disabled={checking}
              >
                {checking ? "Memeriksa…" : "Periksa status pembayaran"}
              </Button>
            )}
          </div>
        </Panel>
      </div>
    </>
  );
}
