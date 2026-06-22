"use client";

import Link from "next/link";
import { useState } from "react";

type ReportActionsProps = {
  reportTitle: string;
  websiteUrl: string;
};

export default function ReportActions({
  reportTitle,
  websiteUrl,
}: ReportActionsProps) {
  const [copied, setCopied] = useState(false);

  function downloadReport() {
    window.print();
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const emailSubject = encodeURIComponent(reportTitle);
  const emailBody = encodeURIComponent(
    `Here is the AuditFix report for ${websiteUrl}:\n\n${typeof window !== "undefined" ? window.location.href : ""}`,
  );

  return (
    <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm print:hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            What would you like to do next?
          </h2>

          <p className="mt-2 max-w-2xl text-slate-600">
            Save this report, email it to your team, or scan another website.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={downloadReport}
            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Download Report
          </button>

          <a
            href={`mailto:?subject=${emailSubject}&body=${emailBody}`}
            className="rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Email This Report
          </a>

          <button
            type="button"
            onClick={copyLink}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {copied ? "Link Copied" : "Copy Share Link"}
          </button>

          <Link
            href="/"
            className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-center text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            Run Another Scan
          </Link>
        </div>
      </div>
    </section>
  );
}
