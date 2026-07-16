import FixPlanForm from "@/components/FixPlanForm";
import DeepScanButton from "@/components/DeepScanButton";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ReportActions from "@/components/ReportActions";
import ScoreGauge from "@/components/ScoreGauge";
import BrandHeader from "@/components/BrandHeader";

type AuditChecks = {
  https: boolean;
  title: boolean;
  metaDescription: boolean;
  h1: boolean;
  phoneNumber: boolean;
  appointmentCTA: boolean;
  contactLink: boolean;
  locationSignals: boolean;
  trustSignals: boolean;
  schema: boolean;
};

type AuditRow = {
  id: string;
  created_at: string;
  website_url: string;
  audit_type: string;
  quick_score: number;
  title: string | null;
  meta_description: string | null;
  checks: AuditChecks;
};

type Opportunity = {
  title: string;
  impact: "High" | "Medium" | "Low";
  message: string;
};

function getScoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Needs Attention";
  return "Patient Opportunity Risk";
}

function getScoreMessage(score: number) {
  if (score >= 90) {
    return "Your website shows strong patient-conversion signals. The biggest opportunity now is refinement and competitive advantage.";
  }

  if (score >= 75) {
    return "Your website has a strong foundation, but there are still opportunities to improve visibility, trust, and appointment conversion.";
  }

  if (score >= 60) {
    return "Your website is showing some useful signals, but several improvements may help more patients find, trust, and contact your practice.";
  }

  return "Your website may be missing important signals that help patients feel confident enough to call, book, or request an appointment.";
}

function getIndustryComparison(score: number) {
  return {
    industryAverage: 59,
    topPractices: 86,
    differenceFromAverage: score - 59,
  };
}

function getBenchmarkMessage(score: number) {
  if (score >= 86) {
    return "Your website is performing at the level of many top-performing dental websites.";
  }

  if (score >= 59) {
    return "Your website is performing above the dental industry benchmark, with opportunities to close the gap with stronger-performing practices.";
  }

  return "Your website is currently below the dental industry benchmark. The priority opportunities in this report may improve patient trust, visibility, and appointment conversion.";
}

const checkLabels: Record<keyof AuditChecks, string> = {
  https: "Secure HTTPS website",
  title: "Page title detected",
  metaDescription: "Meta description detected",
  h1: "Main heading detected",
  phoneNumber: "Phone number or click-to-call detected",
  appointmentCTA: "Appointment or contact CTA detected",
  contactLink: "Contact or location link detected",
  locationSignals: "Location signals detected",
  trustSignals: "Trust signals detected",
  schema: "Schema markup detected",
};

const checkDescriptions: Record<keyof AuditChecks, string> = {
  https:
    "A secure website helps patients trust the site and prevents browser security warnings.",
  title:
    "The page title helps search engines and patients understand what the practice offers.",
  metaDescription:
    "A strong meta description can improve how the practice appears in search results.",
  h1:
    "A clear main heading helps patients and search engines quickly understand the page.",
  phoneNumber:
    "Patients should be able to call the office quickly, especially from mobile search.",
  appointmentCTA:
    "A clear appointment action helps turn website visitors into scheduled patients.",
  contactLink:
    "Patients need a simple way to find contact details, office hours, and directions.",
  locationSignals:
    "Location signals help nearby patients and search engines understand where the practice serves.",
  trustSignals:
    "Reviews, team information, insurance details, and credentials help patients feel confident choosing the practice.",
  schema:
    "Schema markup gives search engines structured information about the business.",
};

function buildOpportunities(checks: AuditChecks): Opportunity[] {
  const opportunities: Opportunity[] = [];

  if (!checks.appointmentCTA) {
    opportunities.push({
      title: "Make appointment booking easier to find",
      impact: "High",
      message:
        "Patients should be able to request or schedule an appointment within seconds of landing on the website.",
    });
  }

  if (!checks.phoneNumber) {
    opportunities.push({
      title: "Make the phone number more visible",
      impact: "High",
      message:
        "Many dental patients want to call directly from mobile search. A visible click-to-call option can reduce friction.",
    });
  }

  if (!checks.locationSignals) {
    opportunities.push({
      title: "Strengthen local location signals",
      impact: "High",
      message:
        "Adding clear city, neighborhood, address, or service-area language can help nearby patients understand where the practice is located.",
    });
  }

  if (!checks.https) {
    opportunities.push({
      title: "Secure the website with HTTPS",
      impact: "High",
      message:
        "An unsecured website can make patients hesitate and may trigger browser warnings.",
    });
  }

  if (!checks.trustSignals) {
    opportunities.push({
      title: "Add stronger patient trust signals",
      impact: "Medium",
      message:
        "Reviews, testimonials, team information, insurance details, and credentials can help new patients feel more comfortable contacting the practice.",
    });
  }

  if (!checks.metaDescription) {
    opportunities.push({
      title: "Improve the search result description",
      impact: "Medium",
      message:
        "A clear meta description can make the practice look more relevant and trustworthy when patients see it in search results.",
    });
  }

  if (!checks.schema) {
    opportunities.push({
      title: "Add local business schema",
      impact: "Medium",
      message:
        "Schema markup helps search engines better understand the practice, services, and location.",
    });
  }

  if (!checks.h1) {
    opportunities.push({
      title: "Add a clear main page heading",
      impact: "Low",
      message:
        "A strong main heading helps patients immediately understand the practice and services.",
    });
  }

  return opportunities.slice(0, 5);
}

function getPotentialImpact(checks: AuditChecks) {
  const impactItems: string[] = [];

  if (!checks.appointmentCTA) impactItems.push("Easier appointment booking");
  if (!checks.phoneNumber) impactItems.push("More direct phone inquiries");
  if (!checks.locationSignals) impactItems.push("Stronger local visibility");
  if (!checks.trustSignals) impactItems.push("Improved patient trust");
  if (!checks.metaDescription) impactItems.push("Better search presentation");
  if (!checks.schema) impactItems.push("Clearer search engine understanding");
  if (!checks.https) impactItems.push("More secure browsing experience");

  return impactItems.slice(0, 4);
}

function getImpactStyles(impact: Opportunity["impact"]) {
  if (impact === "High") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (impact === "Medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
}

export default async function PermanentReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pdf?: string }>;
}) {
  const { id } = await params;
  const { pdf } = await searchParams;
  const isPdf = pdf === "1";

  const { data, error } = await supabaseAdmin
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-xl shadow-blue-100/40">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
            !
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950">
            Report not found
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            This report may have been deleted or the link may be incorrect.
          </p>
        </div>
      </main>
    );
  }

  const audit = data as AuditRow;
  const checks = audit.checks;

  const passedChecks = Object.entries(checks).filter(([, passed]) => passed);
  const failedChecks = Object.entries(checks).filter(([, passed]) => !passed);

  const opportunities = buildOpportunities(checks);
  const potentialImpact = getPotentialImpact(checks);

  const generatedAt = new Date(audit.created_at).toLocaleString();

  const benchmark = getIndustryComparison(audit.quick_score);

  const signalCount = Object.keys(checks).length;
  const passedCount = passedChecks.length;
  const missingCount = failedChecks.length;

  return (
    <main className="min-h-screen bg-slate-50 pb-20 text-slate-950">
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-blue-50 via-white to-white" />
        <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -left-40 top-72 h-96 w-96 rounded-full bg-green-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-10">
          {isPdf && (
            <section className="pdf-cover mb-10 flex min-h-[980px] flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
              <div className="p-12">
                <BrandHeader />

                <div className="mt-24">
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-700">
                    Confidential Report
                  </p>

                  <h1 className="mt-6 max-w-3xl text-6xl font-black tracking-tight text-slate-950">
                    Patient Growth Audit Report
                  </h1>

                  <p className="mt-8 text-2xl text-slate-600">
                    {audit.website_url}
                  </p>

                  <div className="mt-16 grid max-w-xl gap-5 text-sm text-slate-600">
                    <div>
                      <p className="font-bold text-slate-950">Generated</p>
                      <p className="mt-1">{generatedAt}</p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-950">Report ID</p>
                      <p className="mt-1">{audit.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 px-12 py-10 text-white">
                <p className="text-lg font-bold">
                  Helping dental practices turn website visitors into patients.
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  Prepared exclusively for this practice.
                </p>
              </div>
            </section>
          )}

          {!isPdf && (
            <BrandHeader
            eyebrow="Quick Audit Complete"
            title="Patient Growth Quick Report"
              subtitle="A professional website assessment showing how your practice may affect patient trust, local visibility, appointment requests, and patient experience."
            />
          )}

          <section className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-blue-100/50">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="p-8 sm:p-10 lg:p-12">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                    Executive Summary
                  </span>

                  <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                    Live Website Analysis
                  </span>
                </div>

                <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
                  Your website has patient growth opportunities worth attention.
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                  {getScoreMessage(audit.quick_score)}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Signals Reviewed
                    </p>
                    <p className="mt-2 text-3xl font-black text-slate-950">
                      {signalCount}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-green-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                      Signals Found
                    </p>
                    <p className="mt-2 text-3xl font-black text-green-700">
                      {passedCount}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-red-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                      Opportunities
                    </p>
                    <p className="mt-2 text-3xl font-black text-red-700">
                      {missingCount}
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
                  Patient Growth Score
                </p>

                <div className="mt-6">
                  <ScoreGauge score={audit.quick_score} />
                </div>

                <p className="mt-6 text-2xl font-black">
                  {getScoreLabel(audit.quick_score)}
                </p>

                <p className="mt-3 leading-7 text-slate-300">
                  Your score summarizes the patient-conversion and visibility
                  signals detected during the homepage audit.
                </p>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-300">
                    Compared with industry benchmark
                  </p>

                  <p className="mt-2 text-3xl font-black">
                    {benchmark.differenceFromAverage >= 0 ? "+" : ""}
                    {benchmark.differenceFromAverage} points
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    versus the dental website benchmark
                  </p>
                </div>
              </div>
            </div>
          </section>

          {!isPdf && (
            <div className="mt-8">
              <ReportActions
                reportTitle="AuditFix Patient Growth Quick Report"
                websiteUrl={audit.website_url}
                auditId={audit.id}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">
              Industry Benchmark
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              See how your website compares.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Your score becomes more useful when viewed alongside the dental
              website benchmark and stronger-performing practice websites.
            </p>
          </div>

          <div className="mt-10 space-y-7">
            {[
              {
                label: "Your Practice",
                value: audit.quick_score,
                bar: "bg-blue-600",
                text: "text-blue-700",
              },
              {
                label: "Top Dental Websites",
                value: benchmark.topPractices,
                bar: "bg-green-600",
                text: "text-green-700",
              },
              {
                label: "Industry Average",
                value: benchmark.industryAverage,
                bar: "bg-slate-400",
                text: "text-slate-700",
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-3 flex items-end justify-between gap-4">
                  <p className="font-bold text-slate-950">{item.label}</p>

                  <p className={`text-2xl font-black ${item.text}`}>
                    {item.value}
                  </p>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${item.bar}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-blue-50 p-6">
            <p className="font-bold leading-7 text-blue-900">
              {getBenchmarkMessage(audit.quick_score)}
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-green-100 bg-green-50 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-xl font-black text-white">
              ✓
            </div>

            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-green-700">
              Strong Signals
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              What&apos;s helping you
            </h2>

            <p className="mt-3 leading-7 text-slate-700">
              These signals are already supporting patient trust, website
              clarity, or conversion.
            </p>

            {passedChecks.length > 0 ? (
              <div className="mt-6 space-y-3">
                {passedChecks.slice(0, 5).map(([key]) => (
                  <div
                    key={key}
                    className="flex items-start gap-3 rounded-2xl bg-white p-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-black text-green-700">
                      ✓
                    </span>

                    <p className="font-semibold text-slate-950">
                      {checkLabels[key as keyof AuditChecks]}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-2xl bg-white p-5 text-slate-700">
                No strong homepage signals were detected yet.
              </p>
            )}
          </article>

          <article className="rounded-[2rem] border border-red-100 bg-red-50 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-xl font-black text-white">
              !
            </div>

            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-red-700">
              Growth Risks
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              What may be costing you patients
            </h2>

            <p className="mt-3 leading-7 text-slate-700">
              These missing signals may create friction before a patient calls
              or requests an appointment.
            </p>

            {failedChecks.length > 0 ? (
              <div className="mt-6 space-y-3">
                {failedChecks.slice(0, 5).map(([key]) => (
                  <div
                    key={key}
                    className="flex items-start gap-3 rounded-2xl bg-white p-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-black text-red-700">
                      ×
                    </span>

                    <p className="font-semibold text-slate-950">
                      {checkLabels[key as keyof AuditChecks]}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-2xl bg-white p-5 text-slate-700">
                No major patient-growth risks were detected from the quick
                homepage checks.
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
              The highest-value opportunities detected.
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Start with the issues most likely to reduce patient friction,
              improve local visibility, or strengthen trust.
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
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-green-50 p-6 text-green-900">
                <p className="font-bold">
                  The quick audit did not detect major missing homepage signals.
                </p>

                <p className="mt-2">
                  A deep scan may still uncover speed, accessibility, SEO, or
                  technical opportunities.
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
                Small website improvements may remove major patient friction.
              </h2>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Based on the missing signals detected, these are the areas most
                likely to improve how patients find, trust, and contact the
                practice.
              </p>

              {potentialImpact.length > 0 ? (
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {potentialImpact.map((item) => (
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
              ) : (
                <p className="mt-7 rounded-2xl bg-green-100 p-5 text-green-900">
                  Your quick audit did not detect major missing conversion
                  signals.
                </p>
              )}
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
                conversion opportunities.
              </p>

              <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-slate-400">
                This estimate is not a guarantee. Actual results depend on
                traffic, local competition, offer strength, and patient
                follow-up.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">
              Audit Evidence
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Evidence behind your score.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              These are the actual homepage signals detected during the live
              audit. Every signal contributes to the Patient Growth Score.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {Object.entries(checks).map(([key, passed]) => {
              const typedKey = key as keyof AuditChecks;

              return (
                <article
                  key={key}
                  className="rounded-3xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${
                        passed
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {passed ? "✓" : "×"}
                    </span>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-950">
                          {checkLabels[typedKey]}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                            passed
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {passed ? "Found" : "Missing"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {checkDescriptions[typedKey]}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {!isPdf && (
          <>
        <section className="mt-8 overflow-hidden rounded-[2rem] bg-blue-700 text-white shadow-xl shadow-blue-200/60">
          <div className="grid lg:grid-cols-[1fr_0.9fr]">
            <div className="p-8 sm:p-10">
              <span className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em]">
                Next Step
              </span>

              <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
                Go beyond the homepage with a Deep Scan.
              </h2>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-blue-100">
                The Quick Audit reviews visible patient-conversion signals. A
                Deep Scan uses Google PageSpeed Insights to analyze
                performance, accessibility, SEO, and technical health.
              </p>

              <div className="mt-8">
                <DeepScanButton
                  auditId={audit.id}
                  websiteUrl={audit.website_url}
                />
              </div>
            </div>

            <div className="grid gap-px bg-blue-600 lg:grid-cols-1">
              {[
                [
                  "Performance",
                  "Discover speed bottlenecks that may frustrate patients.",
                ],
                [
                  "Accessibility",
                  "Identify usability issues affecting patient experience.",
                ],
                [
                  "SEO & Technical Health",
                  "Find hidden issues that may affect discoverability.",
                ],
              ].map(([title, text]) => (
                <div key={title} className="bg-blue-800/50 p-7">
                  <p className="text-lg font-black">{title}</p>
                  <p className="mt-2 leading-7 text-blue-100">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

          </>
        )}

        {!isPdf && (
          <>
        <section
          id="fix-plan"
          className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10"
        >
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">
              Personalized Guidance
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Want a personalized improvement plan?
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Receive focused recommendations for increasing appointment
              requests, improving local visibility, building patient trust, and
              creating a stronger mobile experience.
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
                "Build credibility through stronger trust signals.",
              ],
              [
                "Better Mobile Experience",
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

          </>
        )}

        <section className="mt-8 rounded-3xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-lg font-black text-slate-950">
            How this Quick Audit was calculated
          </h2>

          <p className="mt-3 max-w-4xl leading-7 text-slate-700">
            AuditFix performed a live scan of the public homepage and reviewed
            visible patient-conversion signals including appointment actions,
            contact information, trust indicators, location signals, search
            visibility elements, and website security. Scores are calculated
            automatically from detected signals. Every signal reviewed appears
            in the evidence section above.
          </p>
        </section>
      </div>
    </main>
  );
}
