// Isolated HTTP backend for browser tests. No database, payment provider or real credentials.
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

type Payment = Record<string, unknown> & {
  id: string;
  status: string;
  transaction_id: string | null;
};
const intents = new Map<
  string,
  {
    payment: Payment;
    key: string;
    owner: string;
    requests: number;
    refreshes: number;
    body: Record<string, string>;
  }
>();
const catalogue = ["DANA", "SHOPEEPAY", "QRIS"].map((channel_code) => ({
  channel_code,
  name: channel_code === "SHOPEEPAY" ? "ShopeePay" : channel_code,
  currency: "IDR",
  flow: channel_code === "QRIS" ? "QR" : "REDIRECT",
  min_amount: "10000",
  max_amount: "10000000",
}));

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost"),
    path = url.pathname;
  const reply = (data: unknown, status = 200) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };
  if (path === "/health") return reply({ ok: true });
  let raw = "";
  for await (const chunk of req) raw += chunk;
  const body = Object.fromEntries(new URLSearchParams(raw));
  if (path === "/auth/login")
    return reply({
      result: {
        token: `test-${body.email}`,
        user_id: body.email,
        pinSet: true,
      },
    });
  const owner = req.headers.authorization?.replace("Bearer test-", "");
  if (!owner || !req.headers.authorization?.startsWith("Bearer test-"))
    return reply({ success: false }, 401);
  const owned = [...intents.values()].filter((entry) => entry.owner === owner);
  if (path === "/profile")
    return reply({
      result: {
        user_id: owner,
        fullname: "Akun Pengujian",
        pinSet: true,
        balance: String(
          owned
            .filter((entry) => entry.payment.transaction_id)
            .reduce((sum, entry) => sum + Number(entry.body.amount), 0),
        ),
      },
    });
  if (path === "/topup/methods") return reply({ result: catalogue });
  if (path === "/historyTransaction")
    return reply({
      result: owned
        .filter((entry) => entry.payment.transaction_id)
        .map(({ payment }) => ({
          id: payment.transaction_id,
          amount: payment.amount,
          type_code: "TOPUP",
          type_id: 99,
          direction: "CREDIT",
          status: "SUCCEEDED",
          recipient_id: owner,
          sender_id: null,
          created_at: payment.created_at,
        })),
      pageInfo: { totalPages: 1 },
    });
  if (path === "/topup" && req.method === "POST") {
    const key = req.headers["idempotency-key"];
    if (
      typeof key !== "string" ||
      !catalogue.some((m) => m.channel_code === body.channel_code) ||
      !/^\d+$/.test(body.amount ?? "") ||
      Number(body.amount) < 10000 ||
      Number(body.amount) > 10000000 ||
      Object.keys(body).some(
        (field) => !["amount", "channel_code"].includes(field),
      )
    )
      return reply({ success: false }, 400);
    const previous = owned.find((entry) => entry.key === key);
    if (previous) {
      previous.requests++;
      if (JSON.stringify(previous.body) !== JSON.stringify(body))
        return reply({ success: false }, 409);
      return reply({ result: previous.payment });
    }
    const payment: Payment = {
      id: randomUUID(),
      amount: body.amount,
      channel_code: body.channel_code,
      currency: "IDR",
      status: owner.startsWith("unknown") ? "UNKNOWN" : "REQUIRES_ACTION",
      transaction_id: null,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 3600000).toISOString(),
      actions:
        body.channel_code === "QRIS"
          ? [
              {
                type: "PRESENT_TO_CUSTOMER",
                descriptor: "QR_STRING",
                value: "000201010212-test-payment",
              },
            ]
          : [
              {
                type: "REDIRECT_CUSTOMER",
                descriptor: "WEB_URL",
                value: "https://checkout.example.test/pay",
              },
              {
                type: "REDIRECT_CUSTOMER",
                descriptor: "DEEPLINK_URL",
                value: "dana://checkout/pay",
              },
            ],
    };
    intents.set(payment.id, {
      payment,
      key,
      body,
      owner,
      requests: 1,
      refreshes: 0,
    });
    // Simulate a lost create acknowledgement after the durable reservation.
    if (owner.startsWith("retry")) return reply({ success: false }, 502);
    return reply({ result: payment }, payment.status === "UNKNOWN" ? 202 : 201);
  }
  const match = /^\/topups\/([^/]+)(\/refresh)?$/.exec(path);
  if (match) {
    const entry = intents.get(match[1]);
    if (!entry || entry.owner !== owner) return reply({ success: false }, 404);
    if (match[2] && req.method === "POST") {
      entry.refreshes++;
      entry.payment.status = owner.startsWith("failed")
        ? "FAILED"
        : owner.startsWith("expired")
          ? "EXPIRED"
          : "SUCCEEDED";
      entry.payment.transaction_id =
        entry.payment.status === "SUCCEEDED" && !owner.startsWith("unlinked")
          ? `tx-${entry.payment.id}`
          : null;
      entry.payment.paid_at = new Date().toISOString();
      // Deliberately leave stale actions; the BFF must remove them for terminal states.
    }
    return reply({ result: entry.payment });
  }
  if (path === "/__test/capture" && req.method === "POST") {
    const entry = intents.get(body.id);
    if (!entry || entry.owner !== owner) return reply({ success: false }, 404);
    entry.payment.status = "SUCCEEDED";
    entry.payment.transaction_id = `tx-${entry.payment.id}`;
    entry.payment.paid_at = new Date().toISOString();
    return reply({ ok: true });
  }
  if (path === "/__test/intents") return reply({ result: owned });
  reply({ success: false }, 404);
});
server.listen(3201, "127.0.0.1");
