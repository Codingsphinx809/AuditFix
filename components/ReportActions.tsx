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
  auditId,
}: ReportActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  async function downloadReport() {
    if (isDownloading) return;

    setIsDownloading(true);
    setDownloadError("");

    try {
      const reportPath = window.location.pathname;

      const response = await fetch("/api/download-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auditId,
          reportType: reportTitle,
          reportPath,
        }),
      });

      if (!response.ok) {
        let errorMessage =
          "AuditFix could not generate the PDF. Please try again.";

        try {
          const errorData = await response.json();

          if (
            errorData &&
            typeof errorData.error === "string" &&
            errorData.error.trim()
          ) {
            errorMessage = errorData.error;
          }
        } catch {
          // Keep the default message when the response is not JSON.
        }

        throw new Error(errorMessage);
      }

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/pdf")) {
        throw new Error(
          "The server returned an unexpected response instead of a PDF.",
        );
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const contentDisposition = response.headers.get("content-disposition");
      const filenameMatch = contentDisposition?.match(
        /filename="?([^";]+)"?/i,
      );

      const filename =
        filenameMatch?.[1] ||
        `auditfix-report-${auditId}.pdf`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);
    } catch (error) {
      console.error("Report download error:", error);

      setDownloadError(
        error instanceof Error
          ? error.message
          : "AuditFix could not generate the PDF. Please try again.",
      );
    } finally {
      setIsDownloading(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy link error:", error);
    }
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm print:hidden">
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700">
            Report Actions
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            What would you like to do next?
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Download your professional report, send it to your inbox, share it
            with your team, or continue improving your patient experience and
            online visibility.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <button
            type="button"
            onClick={downloadReport}
            disabled={isDownloading}
            className="rounded-3xl border border-blue-200 bg-blue-50 p-5 text-left transition hover:-translate-y-1 hover:bg-blue-100 hover:shadow-lg disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-700 text-xl text-white">
              {isDownloading ? "…" : "↓"}
            </div>

            <h3 className="mt-4 font-bold text-slate-950">
              {isDownloading
                ? "Generating PDF..."
                : "Download PDF Report"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isDownloading
                ? "AuditFix is preparing your branded report."
                : "Download a polished copy of your Patient Growth Report."}
            </p>
          </button>

          <EmailReportButton
            reportTitle={reportTitle}
            websiteUrl={websiteUrl}
          />

          <button
            type="button"
            onClick={copyLink}
            className="rounded-3xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:bg-slate-50 hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-xl">
              ↗
            </div>

            <h3 className="mt-4 font-bold text-slate-950">
              {copied ? "Link Copied" : "Copy Share Link"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {copied
                ? "The permanent report link is ready to share."
                : "Share this report with colleagues or stakeholders."}
            </p>
          </button>

          <Link
            href="/"
            className="rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:bg-slate-50 hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-xl">
              ↻
            </div>

            <h3 className="mt-4 font-bold text-slate-950">
              Run Another Scan
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Analyze another dental practice website.
            </p>
          </Link>

          <a
            href="#fix-plan"
            className="rounded-3xl border border-green-200 bg-green-50 p-5 transition hover:-translate-y-1 hover:bg-green-100 hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-xl text-white">
              ✓
            </div>

            <h3 className="mt-4 font-bold text-slate-950">
              Get My Custom Fix Plan
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Receive personalized recommendations for your website.
            </p>
          </a>
        </div>

        {downloadError && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
          >
            {downloadError}
          </div>
        )}
      </div>
    </section>
  );
}
