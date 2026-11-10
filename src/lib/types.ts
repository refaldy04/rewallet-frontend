export type Profile = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  balance: number | null;
  pinSet: boolean;
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
export type TopupMethod = {
  channelCode: string;
  name: string;
  minAmount: number;
  maxAmount: number;
};
export type TopupAction = {
  descriptor: "WEB_URL" | "DEEPLINK_URL" | "QR_STRING";
  value: string;
};
export type TopupPayment = {
  id: string;
  amount: number;
  channelCode: string;
  status:
    | "CREATED"
    | "UNKNOWN"
    | "PENDING"
    | "REQUIRES_ACTION"
    | "ACCEPTING_PAYMENTS"
    | "AUTHORIZED"
    | "SUCCEEDED"
    | "FAILED"
    | "CANCELED"
    | "EXPIRED";
  transactionId: string | null;
  actions: TopupAction[];
  expiresAt: string;
  paidAt: string;
  createdAt: string;
};
export type TopupIntent = {
  key: string;
  amount: number;
  channelCode: string;
  id?: string;
};
export type Session = {
  mode: "demo" | "live";
  token?: string;
  id: string;
  pinSet: boolean;
  expires: number;
};
export type Draft = {
  recipientId: string;
  amount: number;
  notes: string;
  key: string;
};
