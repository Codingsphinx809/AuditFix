"use client";

import { generateInsights } from "@/lib/auditInsights";
import { useEffect, useState } from "react";

type AuditResult = {
  websiteUrl: string;
  scores: {
    mobilePerformance: number | null;
    desktopPerformance: number | null;
    accessibility: number | null;
    seo: number | null;
    bestPractices: number | null;
  };
};

function getScoreLabel(score: number | null) {
  if (score === null) return "Unable to verify";
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Needs Attention";
  return "Patient Opportunity Risk";
}

function calculatePatientGrowthScore(scores: AuditResult["scores"]) {
  const mobile = scores.mobilePerformance ?? 0;
  const desktop = scores.desktopPerformance ?? 0;
  const accessibility = scores.accessibility ?? 0;
  const seo = scores.seo ?? 0;
  const bestPractices = scores.bestPractices ?? 0;

  return Math.round(
    mobile * 0.35 +
      seo * 0.25 +
      accessibility * 0.15 +
      bestPractices * 0.15 +
      desktop * 0.1,
  );
}

export default function ReportPage() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem("auditResult");

    if (storedResult) {
      setAuditResult(JSON.parse(storedResult));
    }
  }, []);

  if (!auditResult) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">
            No audit found
          </h1>
          <p className="mt-3 text-slate-600">
            Please run a website audit first.
          </p>
        </div>
      </main>
    );
  }

  const patientGrowthScore = calculatePatientGrowthScore(auditResult.scores);
  const insights = generateInsights(auditResult.scores);

  const scoreCards = [
    {
      title: "Mobile Experience",
      score: auditResult.scores.mobilePerformance,
      description:
        "Measures how well the site performs for patients browsing from phones.",
    },
    {
      title: "Local Visibility",
      score: auditResult.scores.seo,
      description:
        "Uses SEO signals that may affect how easily patients find the practice online.",
    },
    {
      title: "Accessibility",
      score: auditResult.scores.accessibility,
      description:
        "Reviews whether the website is usable for patients with different accessibility needs.",
    },
    {
      title: "Technical Health",
      score: auditResult.scores.bestPractices,
      description:
        "Checks technical quality signals that can affect reliability and trust.",
    },
    {
      title: "Desktop Performance",
      score: auditResult.scores.desktopPerformance,
      description:
        "Measures how well the website performs on desktop devices.",
    },
  ];

  const helpingCards = scoreCards
    .filter((card) => card.score !== null && card.score >= 75)
    .slice(0, 3);

  const riskCards = scoreCards
    .filter((card) => card.score === null || card.score < 75)
    .slice(0, 3);

  const opportunityCards = scoreCards
    .filter((card) => card.score === null || card.score < 90)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Audit Complete</p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Patient Growth Score
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Website analyzed: {auditResult.websiteUrl}
          </p>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="rounded-2xl bg-blue-50 px-8 py-6 text-center">
              <div className="text-5xl font-bold text-blue-700">
                {patientGrowthScore}
              </div>
              <div className="text-sm font-medium text-blue-700">
                out of 100
              </div>
            </div>

            <div>
              <p className="max-w-xl text-slate-600">
                {patientGrowthScore >= 75
                  ? "Your website has a strong foundation, with opportunities to improve patient inquiries and local visibility."
                  : "Your website may have several issues limiting patient inquiries, trust, mobile experience, or local visibility."}
              </p>

              <p className="mt-3 font-semibold text-blue-700">
                {getScoreLabel(patientGrowthScore)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {scoreCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-semibold text-slate-500">
                {card.title}
              </p>

              <p className="mt-3 text-3xl font-bold text-slate-950">
                {card.score ?? "—"}
              </p>

              <p className="mt-1 text-sm font-medium text-blue-700">
                {getScoreLabel(card.score)}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {card.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-green-50 p-6">
            <h2 className="font-bold text-green-900">
              What&apos;s Helping You
            </h2>

            {helpingCards.length > 0 ? (
              <ul className="mt-4 space-y-2 text-green-900">
                {helpingCards.map((card) => (
                  <li key={card.title}>✓ {card.title} is performing well</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-green-900">
                No strong areas were detected from the available checks yet.
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-red-50 p-6">
            <h2 className="font-bold text-red-900">
              What May Be Costing You Patients
            </h2>

            {riskCards.length > 0 ? (
              <ul className="mt-4 space-y-2 text-red-900">
                {riskCards.map((card) => (
                  <li key={card.title}>✕ {card.title} needs attention</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-red-900">
                No major patient-growth risks were detected from the available
                checks.
              </p>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Top Opportunities
          </h2>

          <p className="mt-2 text-slate-600">
            Based on real website data, these improvements are likely to have
            the greatest impact on patient acquisition.
          </p>

          {opportunityCards.length > 0 ? (
            <div className="mt-6 space-y-4">
              {opportunityCards.map((card, index) => (
                <article
                  key={card.title}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <h3 className="font-semibold text-slate-950">
                    {index + 1}. Improve {card.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
              No major improvement opportunities were detected from the
              available checks.
            </p>
          )}
        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">Key Findings</h2>

          <p className="mt-2 text-slate-600">
            Here&apos;s what may be affecting patient acquisition and website
            performance.
          </p>

          {insights.length > 0 ? (
            <div className="mt-6 space-y-4">
              {insights.map((insight) => (
                <article
                  key={insight.title}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        insight.impact === "High"
                          ? "bg-red-100 text-red-700"
                          : insight.impact === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {insight.impact} Impact
                    </span>

                    <h3 className="font-semibold text-slate-950">
                      {insight.title}
                    </h3>
                  </div>

                  <p className="mt-3 text-slate-600">{insight.message}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
              No major patient-growth risks were detected from the available
              checks.
            </p>
          )}
        </section>

        <section className="mt-8 rounded-2xl bg-blue-700 p-8 text-white">
          <h2 className="text-2xl font-bold">
            Want Help Fixing These Issues?
          </h2>

          <p className="mt-3 max-w-2xl text-blue-100">
            Your free audit highlights opportunities that may be limiting
            patient growth. Auditfix can help prioritize and implement
            improvements.
          </p>

          <button className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-200">
            Request a Fix Plan
          </button>
        </section>
      </div>
    </main>
  );
}