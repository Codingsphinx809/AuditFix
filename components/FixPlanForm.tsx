"use client";

import { useState } from "react";

type FixPlanFormProps = {
  auditId: string;
};

export default function FixPlanForm({ auditId }: FixPlanFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/fix-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ auditId, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit request.");
      }

      setSuccessMessage(
        "Request received. Your personalized fix plan request has been saved.",
      );
      setEmail("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl bg-slate-950 p-8 text-white">
      <h2 className="text-2xl font-bold">Want a Personalized Fix Plan?</h2>

      <p className="mt-3 max-w-2xl text-slate-300">
        Get a prioritized action plan showing what to fix first to improve
        patient calls, appointment requests, trust, and local visibility.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-xl">
        <label htmlFor="fix-plan-email" className="block text-sm font-medium">
          Email address
        </label>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="fix-plan-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-700 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/30"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400/40 disabled:cursor-not-allowed disabled:bg-slate-600"
          >
            {isSubmitting ? "Sending..." : "Send My Fix Plan"}
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-400">
          No spam. This only saves your request so Auditfix can follow up with a
          relevant action plan.
        </p>

        {successMessage && (
          <p className="mt-4 rounded-xl bg-green-500/10 p-3 text-sm text-green-200">
            {successMessage}
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}