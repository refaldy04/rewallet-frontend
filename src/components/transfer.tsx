"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
} from "@mui/material";
import { api, RequestError } from "@/lib/client";
import { useRemote } from "@/lib/use-remote";
import { amountValue } from "@/lib/validation";
import type { Draft, PageInfo, Recipient, Transaction } from "@/lib/types";
import { money } from "@/lib/format";
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
  RecipientCard,
  Steps,
} from "./ui";
import { SecretField } from "./auth-form";
const DRAFT = "rewallet-draft";
function parseDraft(
  raw: string | null | undefined,
  recipientId: string,
): Draft | null {
  try {
    const d = JSON.parse(raw ?? "null");
    if (
      d?.recipientId === recipientId &&
      typeof d.notes === "string" &&
      typeof d.key === "string"
    ) {
      amountValue(d.amount);
      return d;
    }
  } catch {}
  return null;
}
function readDraft(recipientId: string) {
  return parseDraft(sessionStorage.getItem(DRAFT), recipientId);
}
function subscribeDraft(listener: () => void) {
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
}
function useStoredDraft(recipientId: string) {
  const raw = useSyncExternalStore<string | null | undefined>(
    subscribeDraft,
    () => sessionStorage.getItem(DRAFT),
    () => undefined,
  );
  return { draft: parseDraft(raw, recipientId), ready: raw !== undefined };
}
export function TransferRecipients() {
  const searchParams = useSearchParams(),
    router = useRouter();
  const q = searchParams.get("q") ?? "",
    page = Math.max(1, Number(searchParams.get("page")) || 1);
  const [query, setQuery] = useState(q);
  const { data, loading, error, retry } = useRemote<{
    items: Recipient[];
    pageInfo: PageInfo;
  }>(`recipients?search=${encodeURIComponent(q)}&page=${page}`);
  return (
    <>
      <PageHead
        title="Mau kirim ke siapa?"
        subtitle="Cari penerima, lalu pilih kontak yang sesuai."
        eyebrow="TRANSFER"
      />
      <div className="narrow">
        <Steps step={1} />
        {searchParams.get("notice") === "draft" && (
          <Alert severity="info" className="mb-5">
            Draft transfer belum lengkap. Pilih penerima untuk melanjutkan.
          </Alert>
        )}
        <Panel>
          <h2 className="mb-6">Pilih penerima</h2>
          <form
            className="flex items-start gap-2 mb-4"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/transfer?q=" + encodeURIComponent(query));
            }}
          >
            <TextField
              label="Nama atau nomor telepon"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              slotProps={{
                htmlInput: { maxLength: 100 },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon name="search" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button type="submit" variant="outlined">
              Cari
            </Button>
          </form>
          {loading ? (
            <Loading />
          ) : error ? (
            <ErrorNotice message={error} retry={retry} />
          ) : data?.items.length ? (
            <div>
              {data.items.map((person) => (
                <Link
                  key={person.id}
                  className="receiver-row"
                  href={`/transfer/${encodeURIComponent(person.id)}/amount`}
                >
                  <PersonAvatar name={person.name} />
                  <div>
                    <h3>{person.name}</h3>
                    <p>{person.phone}</p>
                  </div>
                  <Icon name="transfer" />
                </Link>
              ))}
            </div>
          ) : (
            <Empty
              title="Penerima tidak ditemukan."
              text="Coba nama atau nomor lain. Pencarianmu tetap tersimpan di atas."
            />
          )}
          {data && data.pageInfo.totalPages > 1 && (
            <div className="pagination">
              {page > 1 ? (
                <LinkButton
                  href={`/transfer?q=${encodeURIComponent(q)}&page=${page - 1}`}
                >
                  ← Sebelumnya
                </LinkButton>
              ) : (
                <span />
              )}
              <span>
                {page} / {data.pageInfo.totalPages}
              </span>
              {page < data.pageInfo.totalPages ? (
                <LinkButton
                  href={`/transfer?q=${encodeURIComponent(q)}&page=${page + 1}`}
                >
                  Berikutnya →
                </LinkButton>
              ) : (
                <span />
              )}
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
export function TransferAmount({ recipientId }: { recipientId: string }) {
  const router = useRouter(),
    { profile } = useWallet();
  const {
    data: person,
    loading,
    error,
    retry,
  } = useRemote<Recipient>("recipients/" + encodeURIComponent(recipientId));
  const { draft: saved } = useStoredDraft(recipientId);
  const [enteredAmount, setAmount] = useState<string | null>(null),
    [enteredNotes, setNotes] = useState<string | null>(null),
    [validation, setValidation] = useState("");
  const amount = enteredAmount ?? (saved ? String(saved.amount) : "");
  const notes = enteredNotes ?? saved?.notes ?? "";
  function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const value = amountValue(amount, profile?.balance ?? null);
      // A new key represents a newly reviewed intent; Back without changing fields keeps the prior key.
      const old = readDraft(recipientId);
      const key =
        old?.amount === value && old?.notes === notes.trim()
          ? old.key
          : crypto.randomUUID();
      sessionStorage.setItem(
        DRAFT,
        JSON.stringify({
          recipientId,
          amount: value,
          notes: notes.trim(),
          key,
        } satisfies Draft),
      );
      router.push(`/transfer/${encodeURIComponent(recipientId)}/review`);
    } catch (e) {
      setValidation((e as Error).message);
    }
  }
  return (
    <>
      <PageHead
        title="Tentukan nominal."
        subtitle={"Saldo tersedia " + money(profile?.balance) + "."}
        eyebrow="TRANSFER"
      />
      <div className="narrow">
        <Steps step={2} />
        <Panel>
          {loading ? (
            <Loading />
          ) : error ? (
            <ErrorNotice message={error} retry={retry} />
          ) : (
            person && (
              <>
                <RecipientCard person={person} change />
                <form className="form-stack" onSubmit={submit}>
                  <div>
                    <TextField
                      className="amount-field"
                      label="Nominal transfer (Rp)"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      slotProps={{
                        htmlInput: {
                          min: 10000,
                          max: Math.min(
                            profile?.balance ?? 5_000_000,
                            5_000_000,
                          ),
                          step: 1,
                          inputMode: "numeric",
                        },
                      }}
                    />
                    <p className="field-help">
                      Minimum Rp10.000 · maksimum Rp5.000.000
                    </p>
                  </div>
                  <TextField
                    label="Catatan (opsional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Untuk apa transfer ini?"
                    slotProps={{ htmlInput: { maxLength: 100 } }}
                  />
                  {validation && <Alert severity="error">{validation}</Alert>}
                  <div className="form-end">
                    <Link className="text-link" href="/transfer">
                      ← Pilih penerima lain
                    </Link>
                    <Button
                      type="submit"
                      variant="contained"
                      endIcon={<Icon name="next" />}
                      disabled={!profile}
                    >
                      Periksa transfer
                    </Button>
                  </div>
                </form>
              </>
            )
          )}
        </Panel>
      </div>
    </>
  );
}
export function TransferReview({ recipientId }: { recipientId: string }) {
  const router = useRouter(),
    { profile, demo, refresh } = useWallet();
  const {
    data: person,
    loading,
    error,
    retry,
  } = useRemote<Recipient>("recipients/" + encodeURIComponent(recipientId));
  const { draft, ready } = useStoredDraft(recipientId);
  const [open, setOpen] = useState(false),
    [pin, setPin] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [uncertain, setUncertain] = useState(false);
  const locked = useRef(false);
  const draftValid = Boolean(draft);
  useEffect(() => {
    if (ready && !draftValid) router.replace("/transfer?notice=draft");
  }, [ready, draftValid, router]);
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft || locked.current || uncertain) return;
    locked.current = true;
    setBusy(true);
    setMessage("");
    try {
      amountValue(draft.amount, profile?.balance ?? null);
      const transaction = await api<Transaction>("transfer", "POST", {
        ...draft,
        pin,
      });
      sessionStorage.removeItem(DRAFT);
      setPin("");
      setOpen(false);
      await refresh();
      router.replace("/transactions/" + encodeURIComponent(transaction.id));
    } catch (e) {
      setMessage((e as Error).message);
      setPin("");
      if (e instanceof RequestError && e.code === "UNCERTAIN") {
        setUncertain(true);
        setOpen(false);
      }
    } finally {
      setBusy(false);
      locked.current = false;
    }
  }
  return (
    <>
      <PageHead
        title="Periksa sekali lagi."
        subtitle="Pastikan penerima dan nominal sudah sesuai."
        eyebrow="TRANSFER"
      />
      <div className="narrow">
        <Steps step={3} />
        <Panel>
          {loading || !draft ? (
            <Loading />
          ) : error ? (
            <ErrorNotice message={error} retry={retry} />
          ) : (
            person && (
              <>
                <RecipientCard person={person} />
                <div className="detail-row">
                  <span>Nominal transfer</span>
                  <strong className="summary-amount">
                    {money(draft.amount)}
                  </strong>
                </div>
                <div className="detail-row">
                  <span>Sisa saldo setelah transfer</span>
                  <strong>
                    {profile?.balance != null
                      ? money(profile.balance - draft.amount)
                      : "Memuat saldo…"}
                  </strong>
                </div>
                <div className="detail-row">
                  <span>Catatan</span>
                  <strong>{draft.notes || "Tanpa catatan"}</strong>
                </div>
                {demo && (
                  <Alert severity="info" className="mt-6">
                    Simulasi tanpa uang nyata. PIN demo awal: 123456.
                  </Alert>
                )}
                {message && !open && (
                  <Alert
                    severity={uncertain ? "warning" : "error"}
                    className="mt-5"
                  >
                    {message}
                  </Alert>
                )}
                <div className="form-end mt-6">
                  <Link
                    className="text-link"
                    href={`/transfer/${encodeURIComponent(recipientId)}/amount`}
                  >
                    ← Ubah nominal
                  </Link>
                  {uncertain ? (
                    <LinkButton href="/activity" variant="contained">
                      Periksa aktivitas
                    </LinkButton>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setMessage("");
                        setOpen(true);
                      }}
                      disabled={
                        !profile ||
                        busy ||
                        profile.balance === null ||
                        draft.amount > profile.balance
                      }
                      startIcon={<Icon name="lock" />}
                    >
                      Lanjutkan dengan PIN
                    </Button>
                  )}
                </div>
              </>
            )
          )}
        </Panel>
      </div>
      <Dialog
        open={open}
        onClose={() => {
          if (!busy) {
            setOpen(false);
            setPin("");
          }
        }}
        fullWidth
        maxWidth="xs"
        aria-labelledby="pin-title"
      >
        <form onSubmit={send}>
          <DialogTitle id="pin-title">Konfirmasi dengan PIN</DialogTitle>
          <DialogContent>
            <p className="subtitle mb-7">
              Masukkan 6 angka PIN untuk mengonfirmasi transfer{" "}
              {draft && money(draft.amount)} ke {person?.name}.
            </p>
            <SecretField
              label="PIN transfer"
              name="pin"
              pin
              value={pin}
              onChange={setPin}
              autoComplete="off"
            />
            {message && (
              <Alert severity="error" className="mt-5">
                {message}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              disabled={busy}
              onClick={() => {
                setOpen(false);
                setPin("");
              }}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={busy || !/^\d{6}$/.test(pin)}
            >
              {busy ? "Memproses…" : demo ? "Kirim simulasi" : "Kirim transfer"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
