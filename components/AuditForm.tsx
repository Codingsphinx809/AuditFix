"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const progressMessages = [
  "Checking patient conversion signals...",
  "Reviewing local visibility...",
  "Measuring mobile performance...",
  "Evaluating accessibility and usability...",
  "Building your Patient Growth Score...",
];

export default function AuditForm() {
  const router = useRouter();

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading) return;

    const progressTimer = window.setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 90) return currentProgress;
        return currentProgress + 10;
      });
    }, 700);

    const messageTimer = window.setInterval(() => {
      setMessageIndex((currentIndex) =>
        currentIndex < progressMessages.length - 1
          ? currentIndex + 1
          : currentIndex,
      );
    }, 1200);

    return () => {
      window.clearInterval(progressTimer);
      window.clearInterval(messageTimer);
    };
  }, [isLoading]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setProgress(0);
    setMessageIndex(0);

    let normalizedUrl = websiteUrl.trim();

    if (!normalizedUrl) {
      setError(
        "Please enter your practice website, for example: yourdentalpractice.com",
      );
      return;
    }

    if (
      !normalizedUrl.startsWith("http://") &&
      !normalizedUrl.startsWith("https://")
    ) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      setError(
        "Please enter a valid website address, for example: yourdentalpractice.com",
      );
      return;
    }

    setIsLoading(true);

    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 120000);

    try {
      const response = await fetch("/api/quick-audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ websiteUrl: normalizedUrl }),
        signal: controller.signal,
      });

      window.clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to run audit.");
      }

      setProgress(100);
      sessionStorage.setItem("quickAuditResult", JSON.stringify(data));
      router.push(`/report/${data.auditId}`);
    } catch (error) {
      window.clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        setError(
          "This scan is taking longer than expected. The website may be slow or blocking automated testing. Please try another website.",
        );
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        );
      }

      setIsLoading(false);
      setProgress(0);
      setMessageIndex(0);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="w-full">
          <label htmlFor="website" className="sr-only">
            Practice website URL
          </label>

          <input
            id="website"
            name="website"
            type="text"
            required
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            placeholder="Enter your practice website (e.g., yourdentalpractice.com)"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />

          <p className="mt-2 text-xs text-slate-500">
            You can enter your website with or without https://
          </p>

          {error && (
            <p className="mt-3 text-sm font-medium text-red-700">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
        >
          {isLoading ? "Analyzing..." : "Run Free Audit"}
        </button>
      </div>

      {isLoading && (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">
              {progressMessages[messageIndex]}
            </span>
            <span className="font-semibold text-blue-700">{progress}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-700 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-slate-500">
            This can take up to 1–2 minutes because we are collecting real
            website data.
          </p>
        </div>
      )}
    </form>
  );
}
