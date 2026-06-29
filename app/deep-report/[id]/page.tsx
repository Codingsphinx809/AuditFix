import { supabaseAdmin } from "@/lib/supabaseAdmin";
import FixPlanForm from "@/components/FixPlanForm";
import ReportActions from "@/components/ReportActions";

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

function getScoreLabel(score: number | null) {
  if (score === null) return "Unable to verify";
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Needs Attention";
  return "Patient Opportunity Risk";
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

function buildPatientOpportunities(scores: DeepScores) {
  const opportunities: {
    title: string;
    impact: "High" | "Medium" | "Low";
    message: string;
    potentialImpact: string;
  }[] = [];

  if (scores.mobilePerformance === null || scores.mobilePerformance < 75) {
    opportunities.push({
      title: "Help patients reach you faster",
      impact: "High",
      message:
        "Your website may be loading slower than patients expect on mobile devices. Many people looking for a dentist are searching from their phones, and delays can cause them to leave before calling or booking.",
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
        "Some website quality signals may be affecting how reliable or trustworthy the site feels to visitors and search engines.",
      potentialImpact:
        "A more polished, trustworthy experience for prospective patients.",
    });
  }

  return opportunities.slice(0, 5);
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
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">
            Deep report not found
          </h1>
          <p className="mt-3 text-slate-600">
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
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">
            Deep scan not available yet
          </h1>
          <p className="mt-3 text-slate-600">
            Please run the deep scan from the quick audit report first.
          </p>
        </div>
      </main>
    );
  }

  const deepScore = calculateDeepScore(audit.deep_scores);
  const opportunities = buildPatientOpportunities(audit.deep_scores);
  const generatedAt = new Date(audit.created_at).toLocaleString();

  const scoreCards = [
    {
      title: "Mobile Patient Experience",
      score: audit.deep_scores.mobilePerformance,
      description:
        "How quickly patients can load and use your website from a phone.",
    },
    {
      title: "Google Visibility Readiness",
      score: audit.deep_scores.seo,
      description:
        "How well your website supports being understood and found in search.",
    },
    {
      title: "Ease of Use",
      score: audit.deep_scores.accessibility,
      description:
        "How usable the website is for patients with different needs and devices.",
    },
    {
      title: "Website Trust Quality",
      score: audit.deep_scores.bestPractices,
      description:
        "How reliable, modern, and trustworthy the site appears from a technical quality standpoint.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Deep Scan Complete
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Patient Growth Deep Score
          </h1>

          <div className="mt-2 space-y-1 text-sm text-slate-500">
            <p>Website analyzed: {audit.website_url}</p>
            <p>Generated: {generatedAt}</p>
            <p>Report ID: {audit.id}</p>
          </div>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="rounded-2xl bg-blue-50 px-8 py-6 text-center">
              <div className="text-5xl font-bold text-blue-700">
                {deepScore}
              </div>
              <div className="text-sm font-medium text-blue-700">
                out of 100
              </div>
            </div>

            <div>
              <p className="max-w-xl text-slate-600">
                This deeper scan looks at whether your website experience may
                help or hurt patient calls, appointment requests, search
                visibility, and trust.
              </p>

              <p className="mt-3 font-semibold text-blue-700">
                {getScoreLabel(deepScore)}
              </p>
            </div>
          </div>
        </section>

        <ReportActions
          reportTitle="AuditFix Patient Growth Deep Report"
          websiteUrl={audit.website_url}
        />

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-xl font-bold text-slate-950">
            How this deep scan was calculated
          </h2>

          <p className="mt-2 text-slate-700">
            This report uses live Google PageSpeed/Lighthouse data for the
            website you entered. AuditFix translates those results into
            patient-growth language so you can understand how performance,
            accessibility, SEO, and technical quality may affect patient calls,
            trust, and appointment requests.
          </p>

          <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4">
              <p className="font-semibold text-slate-950">
                Google PageSpeed data
              </p>
              <p className="mt-1">
                Scores come from Google&apos;s Lighthouse-based scan.
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="font-semibold text-slate-950">No manual editing</p>
              <p className="mt-1">
                AuditFix does not manually change these scores.
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="font-semibold text-slate-950">
                Business translation
              </p>
              <p className="mt-1">
                Technical findings are rewritten as patient-growth
                opportunities.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
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

        <section className="mt-8 rounded-3xl border border-green-100 bg-green-50 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Estimated Patient Growth Opportunity
          </h2>

          <p className="mt-3 max-w-3xl text-slate-700">
            Based on your deep scan, your website may have opportunities to
            improve mobile experience, trust, search visibility, and appointment
            conversion.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-5">
              <p className="font-semibold text-slate-950">Potential Impact</p>
              <p className="mt-2 text-3xl font-bold text-green-700">
                1–5 more inquiries/month
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Directional estimate based on common dental website improvement
                opportunities.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <p className="font-semibold text-slate-950">
                Highest-Leverage Fixes
              </p>

              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>✓ Improve mobile speed</li>
                <li>✓ Strengthen SEO readiness</li>
                <li>✓ Improve accessibility</li>
                <li>✓ Build patient trust</li>
              </ul>
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            This estimate is not a guarantee. Actual results depend on website
            traffic, local competition, offer strength, and follow-up process.
          </p>
        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Biggest Opportunities to Attract More Patients
          </h2>

          <p className="mt-2 text-slate-600">
            These are the areas most likely to affect how many new patients
            find, trust, and contact your practice.
          </p>

          {opportunities.length > 0 ? (
            <div className="mt-6 space-y-4">
              {opportunities.map((opportunity, index) => (
                <article
                  key={opportunity.title}
                  className="rounded-xl border border-slate-200 p-5"
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

                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-950">
                      Potential patient-growth impact
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {opportunity.potentialImpact}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
              The deep scan did not detect major patient-growth risks from the
              available checks. Your site still may benefit from a manual review
              of messaging, calls-to-action, and local competition.
            </p>
          )}
        </section>

        <section
          id="fix-plan"
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <h2 className="text-3xl font-bold text-slate-950">
            Questions About Your Deep Score?
          </h2>

          <p className="mt-4 max-w-3xl text-slate-600">
            Receive a personalized improvement plan focused on increasing
            appointment requests, improving local visibility, building patient
            trust, and creating a better mobile experience.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="font-semibold text-slate-950">
                ✓ More Appointment Requests
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Recommendations that help visitors become patients.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="font-semibold text-slate-950">
                ✓ Better Local Visibility
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Improve your chances of appearing in local searches.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="font-semibold text-slate-950">
                ✓ Improved Patient Trust
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Build credibility through reviews, trust signals, and clear
                information.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="font-semibold text-slate-950">
                ✓ Faster Mobile Experience
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Deliver a smoother experience for mobile visitors.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <FixPlanForm auditId={audit.id} />
          </div>
        </section>
      </div>
    </main>
  );
}
