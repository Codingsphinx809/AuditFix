"use client";

import { useState } from "react";

type EmailReportButtonProps = {
  reportTitle: string;
  websiteUrl: string;
};

export default function EmailReportButton({
  reportTitle,
  websiteUrl,
}: EmailReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function sendReport() {
    setError("");
    setStatus("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/email-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reportTitle,
          websiteUrl,
          reportUrl: window.location.href,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to email report.");
      }

      setStatus("Report sent. Check your inbox.");
      setEmail("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="w-full text-left"
      >
        <div className="text-2xl">📧</div>

        <h3 className="mt-3 font-semibold text-slate-950">
          Email Me This Report
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          Send a copy of this report to your inbox.
        </p>
      </button>

      {isOpen && (
        <div className="mt-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={sendReport}
            disabled={isSending}
            className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSending ? "Sending..." : "Send Report"}
          </button>

          {status && <p className="mt-3 text-sm text-green-700">{status}</p>}
          {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        </div>
      )}
    </div>
  );
}
