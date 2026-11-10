import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  normalizeTopup,
  normalizeTopupMethods,
  readTopupIntent,
  topupAmountValue,
  topupFinished,
  topupSucceeded,
} from "../src/lib/topup";

const receipt = (extra = {}) => ({
  result: {
    id: randomUUID(),
    amount: "25000",
    currency: "IDR",
    channel_code: "QRIS",
    status: "REQUIRES_ACTION",
    actions: [
      {
        type: "PRESENT_TO_CUSTOMER",
        descriptor: "QR_STRING",
        value: "synthetic-qr",
      },
    ],
    ...extra,
  },
});

test("batas top up memakai katalog backend, terpisah dari batas transfer/demo", () => {
  const [method] = normalizeTopupMethods({
    result: [
      {
        channel_code: "QRIS",
        name: "QRIS",
        currency: "IDR",
        min_amount: "10000",
        max_amount: "10000000",
      },
    ],
  });
  assert.equal(topupAmountValue("10000000", method), 10000000);
  for (const amount of [
    "9999",
    "10000001",
    "1e4",
    "10000.1",
    null,
    {},
    NaN,
    Number.MAX_SAFE_INTEGER + 1,
  ])
    assert.throws(() => topupAmountValue(amount, method));
  assert.throws(() =>
    normalizeTopupMethods({
      result: [
        {
          channel_code: "QRIS",
          currency: "USD",
          min_amount: "1",
          max_amount: "2",
        },
      ],
    }),
  );
});

test("keberhasilan memerlukan status SUCCEEDED dan ID transaksi; status belum dikenal tetap menunggu", () => {
  for (const extra of [
    { status: "SUCCEEDED" },
    { status: "PENDING", transaction_id: "42" },
    { status: "NEW_PROVIDER_STATE" },
  ]) {
    const payment = normalizeTopup(receipt(extra));
    assert.equal(topupSucceeded(payment), false);
    assert.equal(topupFinished(payment), false);
  }
  const payment = normalizeTopup(
    receipt({ status: "SUCCEEDED", transaction_id: 42 }),
  );
  assert.equal(payment.transactionId, "42");
  assert.equal(topupSucceeded(payment), true);
  assert.equal(topupFinished(payment), true);
  assert.deepEqual(payment.actions, []);
  for (const status of ["FAILED", "CANCELED", "EXPIRED"]) {
    const failed = normalizeTopup(receipt({ status }));
    assert.equal(topupFinished(failed), true);
    assert.deepEqual(failed.actions, []);
  }
  assert.throws(() => normalizeTopup(receipt({ id: "wrong-id" })), {
    code: "UNCERTAIN",
  });
});

test("aksi pembayaran hanya memuat QR atau tautan yang aman dan didukung", () => {
  const actions = [
    {
      type: "REDIRECT_CUSTOMER",
      descriptor: "WEB_URL",
      value: "https://checkout.example/payment",
    },
    {
      type: "REDIRECT_CUSTOMER",
      descriptor: "DEEPLINK_URL",
      value: "dana://checkout/payment",
    },
    {
      type: "PRESENT_TO_CUSTOMER",
      descriptor: "QR_STRING",
      value: "000201-test-qr",
    },
    ...[
      "javascript:alert(1)",
      "data:text/html,test",
      "https://user:pass@checkout.example",
      "http://checkout.example",
    ].map((value) => ({
      type: "REDIRECT_CUSTOMER",
      descriptor: "WEB_URL",
      value,
    })),
    {
      type: "REDIRECT_CUSTOMER",
      descriptor: "DEEPLINK_URL",
      value: "javascript:alert(1)",
    },
    {
      type: "API_POST_REQUEST",
      descriptor: "WEB_URL",
      value: "https://checkout.example/private",
    },
  ];
  assert.deepEqual(
    normalizeTopup(receipt({ actions })).actions.map((a) => a.descriptor),
    ["WEB_URL", "DEEPLINK_URL", "QR_STRING"],
  );
});

test("pemulihan permintaan menyimpan kunci, payload dan ID yang sama; data rusak diabaikan", () => {
  const intent = {
    key: randomUUID(),
    amount: 25000,
    channelCode: "DANA",
    id: randomUUID(),
  };
  assert.deepEqual(readTopupIntent(JSON.stringify(intent)), intent);
  assert.deepEqual(
    readTopupIntent(JSON.stringify({ ...intent, id: undefined })),
    { key: intent.key, amount: 25000, channelCode: "DANA" },
  );
  for (const raw of [
    null,
    "not-json",
    JSON.stringify({ ...intent, amount: -1 }),
    JSON.stringify({ ...intent, id: "invalid" }),
  ])
    assert.equal(readTopupIntent(raw), null);
});
