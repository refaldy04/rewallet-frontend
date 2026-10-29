"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRemote } from "@/lib/use-remote";
import type { PageInfo, Transaction } from "@/lib/types";
import {
  Empty,
  ErrorNotice,
  LinkButton,
  Loading,
  PageHead,
  Panel,
  TransactionRow,
} from "./ui";
export default function Activity() {
  const search = useSearchParams(),
    page = Math.max(1, Number(search.get("page")) || 1),
    filter = search.get("filter") ?? "all";
  const { data, loading, error, retry } = useRemote<{
    items: Transaction[];
    pageInfo: PageInfo;
  }>("activity?page=" + page);
  const items = (data?.items ?? []).filter(
    (t) =>
      filter === "all" ||
      (filter === "in" && t.direction === "in") ||
      (filter === "out" && t.direction === "out") ||
      (filter === "pending" && t.status === "pending"),
  );
  return (
    <>
      <PageHead
        title="Setiap langkah tercatat."
        subtitle="Ikuti setiap uang masuk dan keluar dari dompetmu."
        eyebrow="AKTIVITAS"
      />
      <Panel>
        <div className="panel-head">
          <h2>Riwayat aktivitas</h2>
          <small>Waktu Indonesia Barat</small>
        </div>
        <nav className="filter-row" aria-label="Filter aktivitas">
          {[
            ["all", "Semua"],
            ["in", "Uang masuk"],
            ["out", "Uang keluar"],
            ["pending", "Menunggu"],
          ].map(([value, label]) => (
            <Link
              key={value}
              href={`/activity?filter=${value}&page=${page}`}
              aria-current={filter === value ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <p className="field-help mb-3">
          Filter berlaku pada transaksi di halaman ini.
        </p>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorNotice message={error} retry={retry} />
        ) : items.length ? (
          items.map((t) => <TransactionRow key={t.id} transaction={t} />)
        ) : (
          <Empty
            title="Belum ada aktivitas di kategori ini."
            text="Coba kategori lain, halaman lain, atau mulai dengan isi saldo."
          />
        )}
        {data && (
          <div className="pagination">
            {page > 1 ? (
              <LinkButton
                href={`/activity?filter=${filter}&page=${page - 1}`}
                size="small"
              >
                ← Sebelumnya
              </LinkButton>
            ) : (
              <span />
            )}
            <span>
              Halaman {page} dari {data.pageInfo.totalPages}
            </span>
            {page < data.pageInfo.totalPages ? (
              <LinkButton
                href={`/activity?filter=${filter}&page=${page + 1}`}
                size="small"
              >
                Berikutnya →
              </LinkButton>
            ) : (
              <span />
            )}
          </div>
        )}
      </Panel>
    </>
  );
}
