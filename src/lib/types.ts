export type Profile = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  balance: number | null;
  hasPin: boolean;
  picture?: string;
};
export type Recipient = { id: string; name: string; phone: string };
export type Transaction = {
  id: string;
  name: string;
  amount: number;
  direction: "in" | "out" | "unknown";
  kind: "transfer" | "topup";
  status: "success" | "failed" | "pending";
  date: string;
  notes: string;
};
export type PageInfo = { page: number; totalPages: number };
export type Session = {
  mode: "demo" | "live";
  token?: string;
  id: string;
  hasPin: boolean;
  expires: number;
};
export type Draft = {
  recipientId: string;
  amount: number;
  notes: string;
  key: string;
};
