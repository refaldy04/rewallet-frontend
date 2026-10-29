"use client";
import { useState } from "react";
import Link from "next/link";
import { useWallet } from "./wallet-shell";
import {
  Empty,
  ErrorNotice,
  Icon,
  LinkButton,
  Loading,
  PageHead,
  Panel,
  PersonAvatar,
  TransactionRow,
} from "./ui";
import { useRemote } from "@/lib/use-remote";
import { money } from "@/lib/format";
import type { PageInfo, Recipient, Transaction } from "@/lib/types";
export default function Dashboard() {
  const { profile, demo } = useWallet();
  const { data, loading, error, retry } = useRemote<{
    items: Transaction[];
    pageInfo: PageInfo;
  }>("activity");
  const people = useRemote<{ items: Recipient[] }>("recipients");
  const [hidden, setHidden] = useState(false);
  const [today] = useState(() => new Date());
  const transactions = data?.items ?? [];
  const successful = transactions.filter(
    (t) =>
      t.status === "success" &&
      new Date(t.date).getTime() >= today.getTime() - 7 * 86_400_000,
  );
  const incoming = successful
    .filter((t) => t.direction === "in")
    .reduce((n, t) => n + t.amount, 0);
  const outgoing = successful
    .filter((t) => t.direction === "out")
    .reduce((n, t) => n + t.amount, 0);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getTime() - (6 - i) * 86_400_000);
    const key = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
    }).format(d);
    const matches = successful.filter(
      (t) =>
        !Number.isNaN(new Date(t.date).getTime()) &&
        new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(
          new Date(t.date),
        ) === key,
    );
    return {
      label: new Intl.DateTimeFormat("id-ID", {
        weekday: "short",
        timeZone: "Asia/Jakarta",
      }).format(d),
      in: matches
        .filter((t) => t.direction === "in")
        .reduce((n, t) => n + t.amount, 0),
      out: matches
        .filter((t) => t.direction === "out")
        .reduce((n, t) => n + t.amount, 0),
    };
  });
  const highest = Math.max(1, ...days.flatMap((d) => [d.in, d.out]));
  return (
    <>
      <PageHead
        title={"Halo, " + (profile?.name.split(" ")[0] ?? "kamu") + "."}
        subtitle="Kelola uangmu dengan lebih tenang, mulai dari sini."
      >
        <time className="date-label">
          {new Intl.DateTimeFormat("id-ID", {
            dateStyle: "long",
            timeZone: "Asia/Jakarta",
          }).format(new Date())}
        </time>
      </PageHead>
      <div className="dashboard-grid">
        <div className="stack">
          <section className="balance-card" aria-label="Saldo dompet">
            <div className="balance-head">
              <span>Saldo tersedia</span>
              <button
                onClick={() => setHidden((v) => !v)}
                aria-pressed={hidden}
              >
                <Icon name={hidden ? "show" : "hide"} />
                {hidden ? "Tampilkan" : "Sembunyikan"}
              </button>
            </div>
            <p className="balance-value">
              {hidden
                ? "Rp •••••••"
                : profile
                  ? money(profile.balance)
                  : "Memuat saldo…"}
            </p>
            <p className="balance-number">
              Rewallet personal · {profile?.phone || "Nomor belum ditambahkan"}
            </p>
            <div className="balance-actions">
              <LinkButton
                href="/transfer"
                variant="contained"
                startIcon={<Icon name="transfer" />}
              >
                Transfer
              </LinkButton>
              <LinkButton
                href="/top-up"
                variant="outlined"
                startIcon={<Icon name="topup" />}
              >
                Isi saldo
              </LinkButton>
            </div>
          </section>
          <Panel>
            <div className="panel-head">
              <h2>Arus uang</h2>
              <small>
                {demo ? "7 hari · data demo" : "7 hari · aktivitas termuat"}
              </small>
            </div>
            {loading ? (
              <Loading />
            ) : error ? (
              <ErrorNotice message={error} retry={retry} />
            ) : !transactions.length ? (
              <Empty />
            ) : (
              <>
                <div className="flow-summary">
                  <div>
                    <span>
                      <Icon name="topup" />
                      Uang masuk
                    </span>
                    <strong>{money(incoming)}</strong>
                  </div>
                  <div>
                    <span>
                      <Icon name="transfer" />
                      Uang keluar
                    </span>
                    <strong>{money(outgoing)}</strong>
                  </div>
                </div>
                <div
                  className="flow-chart"
                  role="img"
                  aria-label={days
                    .map(
                      (d) =>
                        `${d.label}: masuk ${money(d.in)}, keluar ${money(d.out)}`,
                    )
                    .join("; ")}
                >
                  {days.map((d, i) => (
                    <div className="bar-group" key={i}>
                      <div
                        className="bar"
                        style={{
                          height: `${Math.max(2, (d.in / highest) * 100)}%`,
                        }}
                      />
                      <div
                        className="bar out"
                        style={{
                          height: `${Math.max(2, (d.out / highest) * 100)}%`,
                        }}
                      />
                      <span>{d.label}</span>
                    </div>
                  ))}
                </div>
                <div className="chart-legend">
                  <span>
                    <i />
                    Uang masuk
                  </span>
                  <span>
                    <i className="out" />
                    Uang keluar
                  </span>
                </div>
                <p className="field-help text-center mt-4">
                  Dihitung dari {transactions.length} aktivitas terbaru yang
                  ditampilkan.
                </p>
              </>
            )}
          </Panel>
        </div>
        <div className="stack">
          <Panel>
            <div className="panel-head">
              <h2>{demo ? "Kirim lagi" : "Penerima Rewallet"}</h2>
              <Link className="text-link" href="/transfer">
                Lihat semua
              </Link>
            </div>
            {people.loading ? (
              <p className="field-help">Memuat penerima…</p>
            ) : people.error ? (
              <ErrorNotice message={people.error} retry={people.retry} />
            ) : people.data?.items.length ? (
              <div className="people">
                {people.data.items.slice(0, 4).map((person) => (
                  <Link
                    className="person"
                    key={person.id}
                    href={`/transfer/${encodeURIComponent(person.id)}/amount`}
                  >
                    <PersonAvatar name={person.name} />
                    {person.name.split(" ")[0]}
                  </Link>
                ))}
              </div>
            ) : (
              <Empty
                title="Belum ada penerima."
                text="Penerima akan tampil ketika tersedia."
              />
            )}
          </Panel>
          <Panel>
            <div className="panel-head">
              <h2>Aktivitas terbaru</h2>
              <Link className="text-link" href="/activity">
                Lihat semua
              </Link>
            </div>
            {loading ? (
              <Loading />
            ) : error ? (
              <ErrorNotice message={error} retry={retry} />
            ) : transactions.length ? (
              transactions
                .slice(0, 3)
                .map((t) => <TransactionRow key={t.id} transaction={t} />)
            ) : (
              <Empty />
            )}
          </Panel>
          <aside className="tip">
            <h3>Satu tempat, semua lebih jelas.</h3>Lihat setiap uang masuk dan
            keluar melalui menu Aktivitas.
          </aside>
        </div>
      </div>
    </>
  );
}
