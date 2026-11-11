"use client";

import { useState } from "react";

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadCheckout() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = CHECKOUT_SRC;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

async function post(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) throw new Error(json.message || `Request failed (${res.status})`);
  return json.data;
}

export default function PayTestClient() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null); // { type: "ok" | "error" | "info", text }

  async function pay() {
    setBusy(true);
    setStatus(null);
    try {
      if (!(await loadCheckout())) throw new Error("Could not load Razorpay Checkout. Check your connection.");
      const order = await post("/api/payments-test/create-order");

      const rzp = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "GuideShala",
        description: "Test payment (Rs 1)",
        prefill: order.prefill,
        theme: { color: "#2563eb" },
        handler: async (response) => {
          try {
            const result = await post("/api/payments-test/verify", response);
            setStatus({ type: "ok", text: `Payment verified via ${result.method || "unknown"} · ${result.paymentId}` });
          } catch (e) {
            setStatus({ type: "error", text: e.message });
          } finally {
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
            setStatus({ type: "info", text: "Checkout closed without paying." });
          },
        },
      });
      rzp.on("payment.failed", (r) => {
        setBusy(false);
        setStatus({ type: "error", text: r?.error?.description || "Payment failed." });
      });
      rzp.open();
    } catch (e) {
      setBusy(false);
      setStatus({ type: "error", text: e.message });
    }
  }

  const tone = { ok: "text-green-700", error: "text-red-600", info: "text-slate-600" };

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-600">Admin · Test only</p>
        <h1 className="mt-1 text-2xl font-semibold">UPI payment test</h1>
        <p className="mt-2 text-sm text-slate-600">
          Charges a fixed ₹1 through Razorpay Checkout (UPI enabled). This page is isolated from bookings.
        </p>
        <button
          onClick={pay}
          disabled={busy}
          className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {busy ? "Working…" : "Pay ₹1"}
        </button>
        {status && <p className={`mt-4 break-words text-sm ${tone[status.type]}`}>{status.text}</p>}
      </div>
    </main>
  );
}
