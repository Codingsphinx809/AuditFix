import { supabaseAdmin } from "@/lib/supabaseAdmin";
import FixPlanForm from "@/components/FixPlanForm";
import ReportActions from "@/components/ReportActions";
import ScoreGauge from "@/components/ScoreGauge";
import BrandHeader from "@/components/BrandHeader";

type DeepScores = {
  mobilePerformance: number | null;
  desktopPerformance: number | null;
  accessibility: number | null;
  seo: number | null;
  bestPractices: number | null;
};

type AuditRow = {
  id: string;
  created_at: string;
  website_url: string;
  deep_scores: DeepScores | null;
};

type PatientOpportunity = {
  title: string;
  impact: "High" | "Medium" | "Low";
  message: string;
  potentialImpact: string;
};

type ScoreCard = {
  title: string;
  shortTitle: string;
  score: number | null;
  description: string;
};

function getScoreLabel(score: number | null) {
  if (score === null) return "Unable to verify";
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Needs Attention";
  return "Patient Opportunity Risk";
}

function getScoreMessage(score: number) {
  if (score >= 90) {
    return "Your website demonstrates strong technical health across mobile performance, search readiness, accessibility, and trust quality.";
  }

  if (score >= 75) {
    return "Your website has a strong technical foundation, with several opportunities to improve patient experience and competitive visibility.";
  }

  if (score >= 60) {
    return "Your website shows a workable foundation, but technical improvements may help more patients find, trust, and contact your practice.";
  }

  return "Your website may have technical barriers that make it harder for patients to find, use, and trust the practice online.";
}

function calculateDeepScore(scores: DeepScores) {
  const mobile = scores.mobilePerformance ?? 0;
  const accessibility = scores.accessibility ?? 0;
  const seo = scores.seo ?? 0;
  const bestPractices = scores.bestPractices ?? 0;

  return Math.round(
    mobile * 0.4 +
      seo * 0.25 +
      accessibility * 0.2 +
      bestPractices * 0.15,
  );
}

function buildPatientOpportunities(
  scores: DeepScores,
): PatientOpportunity[] {
  const opportunities: PatientOpportunity[] = [];

  if (scores.mobilePerformance === null || scores.mobilePerformance < 75) {
    opportunities.push({
      title: "Help patients reach you faster",
      impact: "High",
      message:
        "Your website may load more slowly than patients expect on mobile devices. Many people searching for a dentist use their phones, and delays can cause them to leave before calling or booking.",
      potentialImpact:
        "More appointment requests, fewer abandoned visits, and a smoother mobile experience.",
    });
  }

  if (scores.seo === null || scores.seo < 85) {
    opportunities.push({
      title: "Make it easier for local patients to find you",
      impact: "High",
      message:
        "Your website may be missing signals that help search engines understand your practice, services, and relevance to nearby patients.",
      potentialImpact:
        "More qualified visitors discovering your practice through Google search.",
    });
  }

  if (scores.accessibility === null || scores.accessibility < 85) {
    opportunities.push({
      title: "Make the website easier for every patient to use",
      impact: "Medium",
      message:
        "Some visitors may have trouble navigating, reading, or interacting with parts of the website. Improving accessibility can make the site easier to use for everyone.",
      potentialImpact:
        "A better patient experience and fewer barriers for people trying to contact your office.",
    });
  }

  if (scores.bestPractices === null || scores.bestPractices < 85) {
    opportunities.push({
      title: "Strengthen online trust and reliability",
      impact: "Medium",
      message:
        "Some website quality signals may affect how reliable or trustworthy the site feels to visitors and search engines.",
      potentialImpact:
        "A more polished and trustworthy experience for prospective patients.",
    });
  }

  return opportunities.slice(0, 5);
}

function getImpactStyles(impact: PatientOpportunity["impact"]) {
  if (impact === "High") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (impact === "Medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
}

function getScoreBarColor(score: number | null) {
  if (score === null) return "bg-slate-300";
  if (score >= 90) return "bg-green-600";
  if (score >= 75) return "bg-blue-600";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-600";
}

function getScoreTextColor(score: number | null) {
  if (score === null) return "text-slate-500";
  if (score >= 90) return "text-green-700";
  if (score >= 75) return "text-blue-700";
  if (score >= 60) return "text-amber-700";
  return "text-red-700";
}

export default async function PermanentDeepReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-xl shadow-blue-100/40">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl font-black text-red-700">
            !
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950">
            Deep report not found
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            This report may have been deleted or the link may be incorrect.
          </p>
        </div>
      </main>
    );
  }

  const audit = data as AuditRow;

  if (!audit.deep_scores) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-xl shadow-blue-100/40">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-black text-blue-700">
            …
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950">
            Deep scan not available yet
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            Please run the Deep Scan from the Quick Audit report first.
          </p>
        </div>
      </main>
    );
  }

  const deepScore = calculateDeepScore(audit.deep_scores);
  const opportunities = buildPatientOpportunities(audit.deep_scores);
  const generatedAt = new Date(audit.created_at).toLocaleString();

  const scoreCards: ScoreCard[] = [
    {
      title: "Mobile Patient Experience",
      shortTitle: "Mobile Performance",
      score: audit.deep_scores.mobilePerformance,
      description:
        "How quickly patients can load and use your website from a phone.",
    },
    {
      title: "Desktop Performance",
      shortTitle: "Desktop Performance",
      score: audit.deep_scores.desktopPerformance,
      description:
        "How efficiently the website loads for desktop visitors and office users.",
    },
    {
      title: "Google Visibility Readiness",
      shortTitle: "SEO Readiness",
      score: audit.deep_scores.seo,
      description:
        "How well your website supports being understood and found in search.",
    },
    {
      title: "Ease of Use",
      shortTitle: "Accessibility",
      score: audit.deep_scores.accessibility,
      description:
        "How usable the website is for patients with different needs and devices.",
    },
    {
      title: "Website Trust Quality",
      shortTitle: "Best Practices",
      score: audit.deep_scores.bestPractices,
      description:
        "How reliable, modern, and trustworthy the site appears technically.",
    },
  ];

  const verifiedScores = scoreCards.filter((card) => card.score !== null);
  const strongScores = verifiedScores.filter(
    (card) => (card.score ?? 0) >= 75,
  );
  const attentionScores = verifiedScores.filter(
    (card) => (card.score ?? 100) < 75,
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-20 text-slate-950">
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-blue-50 via-white to-white" />
        <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -left-40 top-72 h-96 w-96 rounded-full bg-green-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-10">
          <BrandHeader
            eyebrow="Deep Scan Complete"
            title="Patient Growth Deep Report"
            subtitle="A comprehensive technical assessment showing how performance, accessibility, SEO, and website quality may affect patient growth."
          />

          <section className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-blue-100/50">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="p-8 sm:p-10 lg:p-12">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                    Executive Summary
                  </span>

                  <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                    Google Lighthouse Data
                  </span>
                </div>

                <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
                  Your website&apos;s technical experience can directly affect
                  patient growth.
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                  {getScoreMessage(deepScore)}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Categories Tested
                    </p>
                    <p className="mt-2 text-3xl font-black text-slate-950">
                      {verifiedScores.length}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-green-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                      Strong Scores
                    </p>
                    <p className="mt-2 text-3xl font-black text-green-700">
                      {strongScores.length}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-red-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                      Need Attention
                    </p>
                    <p className="mt-2 text-3xl font-black text-red-700">
                      {attentionScores.length}
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-6">
                  <div className="space-y-1 text-sm text-slate-500">
                    <p>
                      <span className="font-semibold text-slate-700">
                        Website:
                      </span>{" "}
                      {audit.website_url}
                    </p>

                    <p>
                      <span className="font-semibold text-slate-700">
                        Generated:
                      </span>{" "}
                      {generatedAt}
                    </p>

                    <p>
                      <span className="font-semibold text-slate-700">
                        Report ID:
                      </span>{" "}
                      {audit.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center bg-slate-950 p-8 text-white sm:p-10 lg:p-12">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">
                  Deep Patient Growth Score
                </p>

                <div className="mt-6">
                  <ScoreGauge score={deepScore} />
                </div>

                <p className="mt-6 text-2xl font-black">
                  {getScoreLabel(deepScore)}
                </p>

                <p className="mt-3 leading-7 text-slate-300">
                  This weighted score combines mobile performance, SEO,
                  accessibility, and technical quality.
                </p>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-300">
                    Highest-weight category
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    Mobile Experience
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Represents 40% of the Deep Score
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8">
            <ReportActions
              reportTitle="AuditFix Patient Growth Deep Report"
              websiteUrl={audit.website_url}
              auditId={audit.id}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">
              Technical Score Breakdown
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              See where your website is strongest—and where it needs attention.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Each category measures a different part of the patient website
              experience using Google Lighthouse data.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {scoreCards.map((card) => (
              <article
                key={card.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-sm font-bold text-slate-500">
                  {card.title}
                </p>

                <p
                  className={`mt-5 text-5xl font-black ${getScoreTextColor(
                    card.score,
                  )}`}
                >
                  {card.score ?? "—"}
                </p>

                <p className="mt-2 text-sm font-bold text-slate-700">
                  {getScoreLabel(card.score)}
                </p>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${getScoreBarColor(
                      card.score,
                    )}`}
                    style={{ width: `${card.score ?? 0}%` }}
                  />
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-600">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-green-100 bg-green-50 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-xl font-black text-white">
              ✓
            </div>

            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-green-700">
              Technical Strengths
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              What&apos;s supporting patient growth
            </h2>

            <p className="mt-3 leading-7 text-slate-700">
              These categories are already providing a stronger technical
              experience for patients and search engines.
            </p>

            {strongScores.length > 0 ? (
              <div className="mt-6 space-y-3">
                {strongScores.map((card) => (
                  <div
                    key={card.title}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-sm font-black text-green-700">
                        ✓
                      </span>

                      <p className="font-semibold text-slate-950">
                        {card.shortTitle}
                      </p>
                    </div>

                    <p className="text-xl font-black text-green-700">
                      {card.score}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-2xl bg-white p-5 text-slate-700">
                No technical categories currently score 75 or higher.
              </p>
            )}
          </article>

          <article className="rounded-[2rem] border border-red-100 bg-red-50 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-xl font-black text-white">
              !
            </div>

            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-red-700">
              Technical Risks
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              What may be creating patient friction
            </h2>

            <p className="mt-3 leading-7 text-slate-700">
              These categories may affect loading speed, usability, trust, or
              the practice&apos;s ability to be discovered.
            </p>

            {attentionScores.length > 0 ? (
              <div className="mt-6 space-y-3">
                {attentionScores.map((card) => (
                  <div
                    key={card.title}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-sm font-black text-red-700">
                        ×
                      </span>

                      <p className="font-semibold text-slate-950">
                        {card.shortTitle}
                      </p>
                    </div>

                    <p className="text-xl font-black text-red-700">
                      {card.score}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-2xl bg-white p-5 text-slate-700">
                All verified technical categories score 75 or higher.
              </p>
            )}
          </article>
        </section>

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-950 p-8 text-white sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
              Priority Action Plan
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              The biggest opportunities to attract and convert more patients.
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              These recommendations translate the technical findings into
              practical business outcomes.
            </p>
          </div>

          <div className="p-8 sm:p-10">
            {opportunities.length > 0 ? (
              <div className="space-y-5">
                {opportunities.map((opportunity, index) => (
                  <article
                    key={opportunity.title}
                    className="grid gap-5 rounded-3xl border border-slate-200 p-6 sm:grid-cols-[64px_1fr] sm:p-7"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-xl font-black text-white">
                      {index + 1}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black text-slate-950">
                          {opportunity.title}
                        </h3>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${getImpactStyles(
                            opportunity.impact,
                          )}`}
                        >
                          {opportunity.impact} Impact
                        </span>
                      </div>

                      <p className="mt-3 leading-7 text-slate-600">
                        {opportunity.message}
                      </p>

                      <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                        <p className="text-sm font-black uppercase tracking-wide text-slate-500">
                          Potential patient-growth impact
                        </p>

                        <p className="mt-2 font-semibold leading-7 text-slate-800">
                          {opportunity.potentialImpact}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-green-50 p-6 text-green-900">
                <p className="font-bold">
                  The Deep Scan did not detect major technical patient-growth
                  risks.
                </p>

                <p className="mt-2">
                  The site may still benefit from a manual review of messaging,
                  appointment actions, content strategy, and local competition.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-green-100 bg-gradient-to-br from-green-50 to-white p-8 shadow-sm sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-green-700">
                Growth Opportunity
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Better technical performance can remove patient friction.
              </h2>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Improvements to mobile speed, accessibility, SEO, and website
                reliability may help more patients discover and use the
                practice website.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Faster mobile experience",
                  "Stronger SEO readiness",
                  "Improved accessibility",
                  "Greater patient trust",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-green-100 bg-white p-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-black text-green-700">
                      ✓
                    </span>

                    <p className="font-semibold text-slate-950">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-300">
                Directional Opportunity
              </p>

              <p className="mt-5 text-5xl font-black tracking-tight">
                1–5
              </p>

              <p className="mt-2 text-2xl font-bold">
                more inquiries per month
              </p>

              <p className="mt-5 leading-7 text-slate-300">
                A directional estimate based on common dental website
                improvement opportunities.
              </p>

              <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-slate-400">
                This estimate is not a guarantee. Actual results depend on
                traffic, local competition, services, offers, and patient
                follow-up.
              </p>
            </div>
          </div>
        </section>

        <section
          id="fix-plan"
          className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10"
        >
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">
              Personalized Guidance
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Want a personalized technical improvement plan?
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Receive focused recommendations for improving mobile speed,
              accessibility, local visibility, patient trust, and appointment
              conversion.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              [
                "More Appointment Requests",
                "Recommendations that help visitors become patients.",
              ],
              [
                "Better Local Visibility",
                "Improve your chances of appearing in nearby searches.",
              ],
              [
                "Improved Patient Trust",
                "Build credibility through stronger trust and quality signals.",
              ],
              [
                "Faster Mobile Experience",
                "Create a smoother experience for mobile visitors.",
              ],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-black text-blue-700">
                    ✓
                  </span>

                  <div>
                    <p className="font-bold text-slate-950">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <FixPlanForm auditId={audit.id} />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-lg font-black text-slate-950">
            How this Deep Scan was calculated
          </h2>

          <p className="mt-3 max-w-4xl leading-7 text-slate-700">
            AuditFix uses live Google PageSpeed and Lighthouse data. The Deep
            Patient Growth Score weights mobile performance at 40%, SEO at 25%,
            accessibility at 20%, and technical best practices at 15%.
            Technical findings are then translated into patient-growth
            opportunities. AuditFix does not manually alter the Lighthouse
            category scores.
          </p>
        </section>
      </div>
    </main>
  );
}
