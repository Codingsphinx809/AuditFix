import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";

type LeadRow = {
  id: string;
  created_at: string;
  email: string;
  status: string;
  audit_id: string;
  audits: {
    id: string;
    website_url: string;
    quick_score: number | null;
    deep_scores: unknown | null;
  } | null;
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

export default async function LeadsPage() {
  const { data, error } = await supabaseAdmin
    .from("fix_requests")
    .select(
      `
      id,
      created_at,
      email,
      status,
      audit_id,
      audits (
        id,
        website_url,
        quick_score,
        deep_scores
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">Leads error</h1>
          <p className="mt-3 text-slate-600">
            Could not load fix plan requests from Supabase.
          </p>
        </div>
      </main>
    );
  }

  const leads = (data ?? []) as LeadRow[];
  const totalLeads = leads.length;
  const deepScanLeads = leads.filter((lead) => lead.audits?.deep_scores).length;
  const averageScore =
    leads.length > 0
      ? Math.round(
          leads.reduce(
            (total, lead) => total + (lead.audits?.quick_score ?? 0),
            0,
          ) / leads.length,
        )
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Auditfix Leads
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Fix Plan Requests
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Track people who requested a personalized fix plan after viewing
            their audit.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
            >
              View Audit Dashboard
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
            >
              Run New Audit
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Leads</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {totalLeads}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Leads With Deep Scan
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {deepScanLeads}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Average Lead Score
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {averageScore}
            </p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-950">
              Recent Fix Plan Requests
            </h2>
          </div>

          {leads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Website</th>
                    <th className="px-6 py-4 font-semibold">Quick Score</th>
                    <th className="px-6 py-4 font-semibold">Deep Scan</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Requested</th>
                    <th className="px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-950">
                          {lead.email}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Lead ID: {lead.id}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="max-w-xs truncate font-medium text-slate-950">
                          {lead.audits?.website_url ?? "Unknown website"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Audit ID: {lead.audit_id}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-950">
                          {lead.audits?.quick_score ?? "—"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {getScoreBadge(lead.audits?.quick_score ?? null)}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        {lead.audits?.deep_scores ? (
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
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {lead.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(lead.created_at)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {lead.audits?.id && (
                            <Link
                              href={`/report/${lead.audits.id}`}
                              className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                            >
                              Quick Report
                            </Link>
                          )}

                          {lead.audits?.id && lead.audits.deep_scores && (
                            <Link
                              href={`/deep-report/${lead.audits.id}`}
                              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                            >
                              Deep Report
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
              No fix plan requests yet. Once someone submits the form on a
              report, they will appear here.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}