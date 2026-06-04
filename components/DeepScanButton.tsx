"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const scanSteps = [
  "Requesting Google PageSpeed analysis",
  "Loading the website in a mobile test environment",
  "Measuring mobile performance",
  "Reviewing accessibility signals",
  "Checking SEO and technical health",
  "Preparing your deep scan report",
];

type DeepScanButtonProps = {
  auditId: string;
  websiteUrl: string;
};

export default function DeepScanButton({
  auditId,
  websiteUrl,
}: DeepScanButtonProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading) return;

    const progressTimer = window.setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 92) return currentProgress;
        return currentProgress + 4;
      });
    }, 1200);

    const stepTimer = window.setInterval(() => {
      setStepIndex((currentIndex) =>
        currentIndex < scanSteps.length - 1 ? currentIndex + 1 : currentIndex,
      );
    }, 5000);

    return () => {
      window.clearInterval(progressTimer);
      window.clearInterval(stepTimer);
    };
  }, [isLoading]);

  async function runDeepScan() {
    setError("");
    setProgress(0);
    setStepIndex(0);
    setIsLoading(true);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ auditId, websiteUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to run deep scan.");
      }

      setProgress(100);
      router.push(`/deep-report/${auditId}`);
    } catch {
      setError(
        "Google PageSpeed could not complete the deep scan right now. This sometimes happens when their service is busy. Please wait 30 seconds and try again.",
      );
      setIsLoading(false);
      setProgress(0);
      setStepIndex(0);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={runDeepScan}
        disabled={isLoading}
        className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-100"
      >
        {isLoading ? "Running Deep Scan..." : "Run Deep Scan"}
      </button>

      {isLoading && (
        <div className="mt-6 rounded-2xl bg-blue-800/40 p-5">
          <div className="mb-3 flex items-center justify-between gap-4 text-sm">
            <span className="font-medium text-blue-50">
              {scanSteps[stepIndex]}...
            </span>
            <span className="font-semibold text-white">{progress}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-blue-950/50">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-5 grid gap-2 text-sm text-blue-100">
            {scanSteps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 transition ${
                  index <= stepIndex ? "bg-white/10" : "opacity-60"
                }`}
              >
                <span>
                  {index < stepIndex ? "✓" : index === stepIndex ? "…" : "○"}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-blue-100">
            Deep scans can take 1–2 minutes because Google is running a full
            performance and accessibility analysis.
          </p>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-100">{error}</p>}
    </div>
  );
}