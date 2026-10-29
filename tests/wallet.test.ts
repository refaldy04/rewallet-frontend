import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { amountValue, pinValue, safeReturnTo } from "../src/lib/validation";
import {
  createDemo,
  demoAccount,
  demoTransfer,
  demoTopup,
  verifyDemoPin,
  deleteDemo,
} from "../src/lib/demo";
import { encodeSession, decodeSession } from "../src/lib/session-codec";
test("nominal divalidasi di batas, bilangan bulat, dan saldo", () => {
  for (const amount of [
    0,
    9999,
    5000001,
    10000.5,
    NaN,
    Infinity,
    "abc",
    [10000],
    { amount: 10000 },
    "1e4",
  ])
    assert.throws(() => amountValue(amount));
  assert.equal(amountValue(10000, 10000), 10000);
  assert.equal(amountValue(5000000), 5000000);
  assert.throws(() => amountValue(10001, 10000));
  assert.throws(() => amountValue(10000, null));
});
test("PIN dan tujuan redirect tidak menerima input tidak valid", () => {
  assert.equal(pinValue("012345"), "012345");
  for (const pin of ["12345", "1234567", "abcdef", 123456])
    assert.throws(() => pinValue(pin));
  for (const url of [
    "https://evil.test",
    "//evil.test",
    "/\\evil.test",
    "/login",
    "/profile\\evil",
    "/dashboard\r\n",
  ])
    assert.equal(safeReturnTo(url), "/dashboard");
  assert.equal(
    safeReturnTo("/transfer/nadia/amount"),
    "/transfer/nadia/amount",
  );
});
test("cookie terenkripsi menolak perubahan dan sesi kedaluwarsa", () => {
  const session = {
    id: "user-1",
    mode: "live" as const,
    token: "private-token",
    hasPin: true,
    expires: Date.now() + 60000,
  };
  const cookie = encodeSession(session);
  assert.ok(!cookie.includes("private-token"));
  assert.deepEqual(decodeSession(cookie), session);
  const parts = cookie.split(".");
  parts[2] = "AA" + parts[2].slice(2);
  assert.equal(decodeSession(parts.join(".")), null);
  assert.equal(
    decodeSession(encodeSession({ ...session, expires: Date.now() - 1000 })),
    null,
  );
  assert.equal(decodeSession("not-a-cookie"), null);
});
test("PIN salah tidak mengurangi saldo, transfer idempoten, sesi terisolasi", () => {
  const id = createDemo(),
    other = createDemo(),
    balance = demoAccount(id).profile.balance!;
  assert.throws(() =>
    demoTransfer(id, "nadia", 100000, "000000", "test", randomUUID()),
  );
  assert.equal(demoAccount(id).profile.balance, balance);
  const key = randomUUID(),
    t = demoTransfer(id, "nadia", 100000, "123456", "test", key);
  assert.equal(
    demoTransfer(id, "nadia", 100000, "123456", "test", key).id,
    t.id,
  );
  assert.equal(demoAccount(id).profile.balance, balance - 100000);
  assert.throws(
    () => demoTransfer(id, "nadia", 200000, "123456", "test", key),
    /sudah digunakan/,
  );
  assert.ok(!demoAccount(other).transactions.some((x) => x.id === t.id));
  const topupKey = randomUUID();
  demoTopup(id, 50000, topupKey);
  demoTopup(id, 50000, topupKey);
  assert.equal(demoAccount(id).profile.balance, balance - 50000);
  deleteDemo(id);
  deleteDemo(other);
});
test("pembatasan percobaan PIN diterapkan di server", () => {
  const id = createDemo();
  for (let i = 0; i < 5; i++) assert.throws(() => verifyDemoPin(id, "000000"));
  assert.throws(() => verifyDemoPin(id, "123456"), /Terlalu banyak/);
  deleteDemo(id);
});
