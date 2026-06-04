import FixPlanForm from "@/components/FixPlanForm";
import DeepScanButton from "@/components/DeepScanButton";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

function getScoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Needs Attention";
  return "Patient Opportunity Risk";
}

const checkLabels: Record<keyof AuditChecks, string> = {
  https: "Secure HTTPS website",
  title: "Page title detected",
  metaDescription: "Meta description detected",
  h1: "Main heading detected",
  phoneNumber: "Phone number or click-to-call detected",
  appointmentCTA: "Appointment or contact CTA detected",
  contactLink: "Contact/location link detected",
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
    "A clear appointment action helps turn visitors into scheduled patients.",
  contactLink:
    "Patients need a simple way to find contact details, office hours, and directions.",
  locationSignals:
    "Location signals help nearby patients and search engines understand where the practice serves.",
  trustSignals:
    "Reviews, team information, insurance details, and credentials help patients feel confident choosing the practice.",
  schema:
    "Schema markup gives search engines structured information about the business.",
};

function buildOpportunities(checks: AuditChecks) {
  const opportunities: {
    title: string;
    impact: "High" | "Medium" | "Low";
    message: string;
  }[] = [];

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
      title: "Add a stronger search result description",
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

  if (!checks.https) {
    opportunities.push({
      title: "Secure the website with HTTPS",
      impact: "High",
      message:
        "An unsecured website can make patients hesitate and may trigger browser warnings.",
    });
  }

  return opportunities.slice(0, 5);
}

export default async function PermanentReportPage({
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
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">
            Report not found
          </h1>
          <p className="mt-3 text-slate-600">
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
  const generatedAt = new Date(audit.created_at).toLocaleString();

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Quick Audit Complete
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Patient Growth Quick Score
          </h1>

          <div className="mt-2 space-y-1 text-sm text-slate-500">
            <p>Website analyzed: {audit.website_url}</p>
            <p>Generated: {generatedAt}</p>
            <p>Report ID: {audit.id}</p>
          </div>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="rounded-2xl bg-blue-50 px-8 py-6 text-center">
              <div className="text-5xl font-bold text-blue-700">
                {audit.quick_score}
              </div>
              <div className="text-sm font-medium text-blue-700">
                out of 100
              </div>
            </div>

            <div>
              <p className="max-w-xl text-slate-600">
                This quick audit reviews visible homepage signals that may
                affect patient trust, local visibility, and appointment
                conversion.
              </p>

              <p className="mt-3 font-semibold text-blue-700">
                {getScoreLabel(audit.quick_score)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-xl font-bold text-slate-950">
            How this quick audit was calculated
          </h2>

          <p className="mt-2 text-slate-700">
            This report is based on a live scan of the website homepage you
            entered. Auditfix reviews visible patient-conversion signals such as
            appointment calls-to-action, contact information, trust indicators,
            location signals, search visibility elements, and website security.
          </p>

          <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4">
              <p className="font-semibold text-slate-950">
                Live website analysis
              </p>
              <p className="mt-1">
                Results are pulled from the current public homepage.
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="font-semibold text-slate-950">
                No manual scoring
              </p>
              <p className="mt-1">
                Auditfix automatically calculates scores based on detected
                signals.
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="font-semibold text-slate-950">
                Fully transparent
              </p>
              <p className="mt-1">
                Every signal reviewed appears below as Found or Missing.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-green-50 p-6">
            <h2 className="font-bold text-green-900">
              What&apos;s Helping You
            </h2>

            {passedChecks.length > 0 ? (
              <ul className="mt-4 space-y-2 text-green-900">
                {passedChecks.slice(0, 5).map(([key]) => (
                  <li key={key}>✓ {checkLabels[key as keyof AuditChecks]}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-green-900">
                No strong homepage signals were detected yet.
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-red-50 p-6">
            <h2 className="font-bold text-red-900">
              What May Be Costing You Patients
            </h2>

            {failedChecks.length > 0 ? (
              <ul className="mt-4 space-y-2 text-red-900">
                {failedChecks.slice(0, 5).map(([key]) => (
                  <li key={key}>
                    ✕ Missing{" "}
                    {checkLabels[key as keyof AuditChecks].toLowerCase()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-red-900">
                No major patient-growth risks were detected from the quick
                homepage checks.
              </p>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Evidence Behind Your Score
          </h2>

          <p className="mt-2 text-slate-600">
            These are the actual signals detected on your homepage during the
            live audit. Each item contributes to your Patient Growth Score.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Object.entries(checks).map(([key, passed]) => {
              const typedKey = key as keyof AuditChecks;

              return (
                <article
                  key={key}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 rounded-full px-2 py-1 text-xs font-semibold ${
                        passed
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {passed ? "Found" : "Missing"}
                    </span>

                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {checkLabels[typedKey]}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {checkDescriptions[typedKey]}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Top Opportunities
          </h2>

          <p className="mt-2 text-slate-600">
            These are the highest-value improvements detected from the quick
            homepage audit.
          </p>

          {opportunities.length > 0 ? (
            <div className="mt-6 space-y-4">
              {opportunities.map((opportunity, index) => (
                <article
                  key={opportunity.title}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        opportunity.impact === "High"
                          ? "bg-red-100 text-red-700"
                          : opportunity.impact === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {opportunity.impact} Impact
                    </span>

                    <h3 className="font-semibold text-slate-950">
                      {index + 1}. {opportunity.title}
                    </h3>
                  </div>

                  <p className="mt-3 text-slate-600">
                    {opportunity.message}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
              The quick audit did not detect major missing homepage signals. A
              deep scan can still uncover speed, accessibility, and technical
              issues.
            </p>
          )}
        </section>

        <section className="mt-8 rounded-2xl bg-blue-700 p-8 text-white">
          <h2 className="text-2xl font-bold">
            Want a Deeper Speed and Accessibility Scan?
          </h2>

          <p className="mt-3 max-w-2xl text-blue-100">
            The quick audit gives immediate homepage insights. A deeper scan can
            take 1–2 minutes because it uses Google PageSpeed data to analyze
            performance, accessibility, SEO, and technical health.
          </p>

          <DeepScanButton auditId={audit.id} websiteUrl={audit.website_url} />
        </section>
        <FixPlanForm auditId={audit.id} />
      </div>
    </main>
  );
}