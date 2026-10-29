"use client";
import Link from "next/link";
import {
  Button,
  Alert,
  Skeleton,
  Avatar,
  type ButtonProps,
} from "@mui/material";
import {
  GridViewRounded,
  NorthEastRounded,
  AddRounded,
  SwapVertRounded,
  PersonOutlineRounded,
  ArrowForwardRounded,
  ArrowBackRounded,
  CheckRounded,
  LockOutlined,
  PhoneOutlined,
  DownloadRounded,
  VisibilityOutlined,
  VisibilityOffOutlined,
  SearchRounded,
  LogoutRounded,
  ExpandMoreRounded,
  CheckCircleOutlineRounded,
  ErrorOutlineRounded,
  ScheduleRounded,
  EditOutlined,
  CloseRounded,
  MailOutlineRounded,
  ShieldOutlined,
} from "@mui/icons-material";
import type { Transaction, Recipient } from "@/lib/types";
import { dateTime, initials, money } from "@/lib/format";
export const icons = {
  dashboard: GridViewRounded,
  transfer: NorthEastRounded,
  topup: AddRounded,
  activity: SwapVertRounded,
  profile: PersonOutlineRounded,
  next: ArrowForwardRounded,
  back: ArrowBackRounded,
  check: CheckRounded,
  lock: LockOutlined,
  phone: PhoneOutlined,
  download: DownloadRounded,
  show: VisibilityOutlined,
  hide: VisibilityOffOutlined,
  search: SearchRounded,
  logout: LogoutRounded,
  down: ExpandMoreRounded,
  success: CheckCircleOutlineRounded,
  error: ErrorOutlineRounded,
  pending: ScheduleRounded,
  edit: EditOutlined,
  close: CloseRounded,
  mail: MailOutlineRounded,
  shield: ShieldOutlined,
};
export function Icon({
  name,
  className = "",
}: {
  name: keyof typeof icons;
  className?: string;
}) {
  const Component = icons[name];
  return (
    <Component className={className} fontSize="small" aria-hidden="true" />
  );
}
export function LinkButton({
  href,
  children,
  ...props
}: ButtonProps & { href: string }) {
  return (
    <Button component={Link} href={href} {...props}>
      {children}
    </Button>
  );
}
export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      className={"brand " + (inverse ? "brand-inverse" : "")}
      aria-label="rewallet. beranda"
    >
      <span className="brand-mark" aria-hidden="true">
        r
      </span>
      rewallet.
    </Link>
  );
}
export function PageHead({
  title,
  subtitle,
  eyebrow = "DOMPET PERSONAL",
  children,
}: {
  title: string;
  subtitle: string;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>
      {children}
    </header>
  );
}
export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={"panel " + className}>{children}</section>;
}
export function Loading() {
  return (
    <div className="space-y-5" aria-label="Memuat data" role="status">
      <Skeleton variant="rounded" height={54} width="60%" />
      <Skeleton variant="rounded" height={220} />
      <Skeleton variant="rounded" height={180} />
      <span className="sr-only">Memuat data…</span>
    </div>
  );
}
export function ErrorNotice({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <Alert
      severity="error"
      action={
        retry && (
          <Button size="small" color="inherit" onClick={retry}>
            Coba lagi
          </Button>
        )
      }
    >
      {message}
    </Alert>
  );
}
export function Empty({
  title = "Belum ada aktivitas.",
  text = "Mulai dengan isi saldo atau kirim uang.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon name="activity" />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
export function PersonAvatar({
  name,
  src,
  size = 42,
}: {
  name: string;
  src?: string;
  size?: number;
}) {
  return (
    <Avatar
      src={src}
      sx={{
        width: size,
        height: size,
        bgcolor: "#e9efda",
        color: "#48612a",
        fontSize: size / 3,
        fontWeight: 650,
      }}
    >
      {initials(name)}
    </Avatar>
  );
}
export function RecipientCard({
  person,
  change = false,
}: {
  person: Recipient;
  change?: boolean;
}) {
  return (
    <div className="recipient-card">
      <PersonAvatar name={person.name} />
      <div>
        <h3>{person.name}</h3>
        <p>{person.phone}</p>
      </div>
      {change && (
        <Link className="text-link ml-auto" href="/transfer">
          Ubah
        </Link>
      )}
    </div>
  );
}
export function Steps({ step }: { step: number }) {
  return (
    <ol className="steps" aria-label="Tahapan transfer">
      {["Penerima", "Nominal", "Konfirmasi"].map((label, i) => (
        <li
          key={label}
          className={i + 1 === step ? "current" : i + 1 < step ? "done" : ""}
          aria-current={i + 1 === step ? "step" : undefined}
        >
          <b>{i + 1 < step ? <Icon name="check" /> : i + 1}</b>
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}
export function StatusPill({ status }: { status: Transaction["status"] }) {
  return (
    <span className={"status-pill status-" + status}>
      {status === "success"
        ? "Berhasil"
        : status === "failed"
          ? "Gagal"
          : "Menunggu konfirmasi"}
    </span>
  );
}
export function TransactionRow({
  transaction: t,
}: {
  transaction: Transaction;
}) {
  return (
    <Link
      href={"/transactions/" + encodeURIComponent(t.id)}
      className="transaction-row"
    >
      <span
        className={
          "transaction-icon " + (t.direction === "in" ? "incoming" : "")
        }
      >
        <Icon name={t.kind === "topup" ? "topup" : "transfer"} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate">{t.name}</h3>
        <p>{dateTime(t.date)}</p>
      </div>
      <div className="transaction-value">
        <strong className={t.direction === "in" ? "positive" : ""}>
          {t.direction === "in" ? "+" : t.direction === "out" ? "−" : ""}
          {money(t.amount)}
        </strong>
        <StatusPill status={t.status} />
      </div>
    </Link>
  );
}
