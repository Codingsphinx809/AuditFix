import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";

type DashboardAuditRow = {
  id: string;
  created_at: string;
  website_url: string;
  audit_type: string;
  quick_score: number | null;
  deep_scores: {
    mobilePerformance?: number | null;
    accessibility?: number | null;
    seo?: number | null;
    bestPractices?: number | null;
  } | null;
  fix_requests: {
    id: string;
    email: string;
    created_at: string;
    status: string;
  }[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

function getScoreBadge(score: number | null) {
  if (score === null) return "Unable to verify";
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Needs Attention";
  return "Risk";
}

export default async function DashboardPage() {
  const { data, error } = await supabaseAdmin
    .from("audits")
    .select(
      `
      id,
      created_at,
      website_url,
      audit_type,
      quick_score,
      deep_scores,
      fix_requests (
        id,
        email,
        created_at,
        status
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">
            Dashboard error
          </h1>
          <p className="mt-3 text-slate-600">
            Could not load audits from Supabase.
          </p>
        </div>
      </main>
    );
  }

  const audits = (data ?? []) as DashboardAuditRow[];
  const totalAudits = audits.length;
  const fixRequests = audits.reduce(
    (total, audit) => total + audit.fix_requests.length,
    0,
  );
  const deepScans = audits.filter((audit) => audit.deep_scores !== null).length;
  const averageScore =
    audits.length > 0
      ? Math.round(
          audits.reduce((total, audit) => total + (audit.quick_score ?? 0), 0) /
            audits.length,
        )
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Auditfix Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Audit Activity
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Track generated audits, deep scans, and fix plan requests in one
            place.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Audits</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {totalAudits}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Fix Plan Requests
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {fixRequests}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Deep Scans</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {deepScans}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Average Quick Score
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {averageScore}
            </p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-950">
              Recent Audits
            </h2>
          </div>

          {audits.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Website</th>
                    <th className="px-6 py-4 font-semibold">Quick Score</th>
                    <th className="px-6 py-4 font-semibold">Deep Scan</th>
                    <th className="px-6 py-4 font-semibold">Fix Plan</th>
                    <th className="px-6 py-4 font-semibold">Created</th>
                    <th className="px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {audits.map((audit) => (
                    <tr key={audit.id}>
                      <td className="px-6 py-4">
                        <p className="max-w-xs truncate font-medium text-slate-950">
                          {audit.website_url}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {audit.id}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-950">
                          {audit.quick_score ?? "—"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {getScoreBadge(audit.quick_score)}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        {audit.deep_scores ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Completed
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            Not run
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {audit.fix_requests.length > 0 ? (
                          <div>
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                              Requested
                            </span>
                            <p className="mt-2 text-xs text-slate-500">
                              {audit.fix_requests[0].email}
                            </p>
                          </div>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            Not requested
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(audit.created_at)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/report/${audit.id}`}
                            className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                          >
                            View Quick
                          </Link>

                          {audit.deep_scores && (
                            <Link
                              href={`/deep-report/${audit.id}`}
                              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                            >
                              View Deep
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-slate-600">
              No audits found yet. Run a quick audit first.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}