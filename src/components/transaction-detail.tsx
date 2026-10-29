"use client";
import { useRemote } from "@/lib/use-remote";
import { dateTime, money } from "@/lib/format";
import type { Transaction } from "@/lib/types";
import { useWallet } from "./wallet-shell";
import {
  ErrorNotice,
  Icon,
  LinkButton,
  Loading,
  PageHead,
  Panel,
  StatusPill,
} from "./ui";
export default function TransactionDetail({ id }: { id: string }) {
  const {
    data: t,
    loading,
    error,
    retry,
  } = useRemote<Transaction>("transactions/" + encodeURIComponent(id));
  const { demo } = useWallet();
  return (
    <>
      <PageHead
        title="Detail aktivitas."
        subtitle="Informasi dan status transaksi dari dompetmu."
        eyebrow="AKTIVITAS"
      />
      <div className="narrow">
        <Panel>
          {loading ? (
            <Loading />
          ) : error ? (
            <>
              <ErrorNotice message={error} retry={retry} />
              <div className="mt-6">
                <LinkButton href="/activity">← Kembali ke aktivitas</LinkButton>
              </div>
            </>
          ) : (
            t && (
              <>
                <div className="result-header" role="status">
                  <span className={"result-icon " + t.status}>
                    <Icon
                      name={
                        t.status === "success"
                          ? "success"
                          : t.status === "failed"
                            ? "error"
                            : "pending"
                      }
                    />
                  </span>
                  <h2>
                    {t.status === "success"
                      ? demo
                        ? "Simulasi berhasil."
                        : "Transaksi berhasil."
                      : t.status === "failed"
                        ? "Transaksi tidak berhasil."
                        : "Sedang memeriksa status."}
                  </h2>
                  <p>
                    {t.status === "success"
                      ? "Rincian aktivitasmu sudah tercatat di bawah."
                      : t.status === "failed"
                        ? "Periksa kembali detail transaksi sebelum membuat permintaan baru."
                        : "Status belum dikonfirmasi. Periksa kembali aktivitas ini sebelum mengirim ulang."}
                  </p>
                </div>
                <div className="detail-row">
                  <span>Nominal</span>
                  <strong className="summary-amount">{money(t.amount)}</strong>
                </div>
                <div className="detail-row">
                  <span>
                    {t.kind === "topup"
                      ? "Jenis aktivitas"
                      : "Penerima / pengirim"}
                  </span>
                  <strong>{t.name}</strong>
                </div>
                <div className="detail-row">
                  <span>Status</span>
                  <StatusPill status={t.status} />
                </div>
                <div className="detail-row">
                  <span>Waktu</span>
                  <strong>{dateTime(t.date)}</strong>
                </div>
                <div className="detail-row">
                  <span>ID transaksi</span>
                  <strong>{t.id}</strong>
                </div>
                <div className="detail-row">
                  <span>Catatan</span>
                  <strong>{t.notes || "Tanpa catatan"}</strong>
                </div>
                <div className="form-end mt-6">
                  <LinkButton href="/activity" variant="outlined">
                    Lihat aktivitas
                  </LinkButton>
                  {t.status === "pending" ? (
                    <LinkButton
                      href={"/transactions/" + encodeURIComponent(id)}
                      onClick={retry}
                      variant="contained"
                    >
                      Periksa status
                    </LinkButton>
                  ) : (
                    <LinkButton href="/dashboard" variant="contained">
                      Kembali ke ringkasan
                    </LinkButton>
                  )}
                </div>
              </>
            )
          )}
        </Panel>
      </div>
    </>
  );
}
