"use client";

import EmailReportButton from "@/components/EmailReportButton";
import Link from "next/link";
import { useState } from "react";

type ReportActionsProps = {
  reportTitle: string;
  websiteUrl: string;
  auditId: string;
};

export default function ReportActions({
  reportTitle,
  websiteUrl,
}: ReportActionsProps) {
  const [copied, setCopied] = useState(false);

async function downloadReport() {
  const response = await fetch("/api/download-report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auditId,
      reportType: reportTitle,
    }),
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "auditfix-report.pdf";
  link.click();

  window.URL.revokeObjectURL(url);
}

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm print:hidden">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-950">
            What would you like to do next?
          </h2>

          <p className="mt-3 max-w-3xl text-slate-600">
            Save this report, share it with your team, or continue improving
            your patient experience and online visibility.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <button
            type="button"
            onClick={downloadReport}
            className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-left transition hover:bg-blue-100"
          >
            <div className="text-2xl">📥</div>

            <h3 className="mt-3 font-semibold text-slate-950">
              Download PDF Report
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Save a printable copy of your Patient Growth Report.
            </p>
          </button>

          <EmailReportButton reportTitle={reportTitle} websiteUrl={websiteUrl} />

          <button
            type="button"
            onClick={copyLink}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:bg-slate-50"
          >
            <div className="text-2xl">🔗</div>

            <h3 className="mt-3 font-semibold text-slate-950">
              {copied ? "Link Copied" : "Copy Share Link"}
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Share this report with colleagues or stakeholders.
            </p>
          </button>

          <Link
            href="/"
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:bg-slate-50"
          >
            <div className="text-2xl">🔄</div>

            <h3 className="mt-3 font-semibold text-slate-950">
              Run Another Scan
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Analyze another practice website.
            </p>
          </Link>

          <a
            href="#fix-plan"
            className="rounded-2xl border border-green-200 bg-green-50 p-5 transition hover:bg-green-100"
          >
            <div className="text-2xl">🛠</div>

            <h3 className="mt-3 font-semibold text-slate-950">
              Get My Custom Fix Plan
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Receive personalized recommendations for your website.
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
