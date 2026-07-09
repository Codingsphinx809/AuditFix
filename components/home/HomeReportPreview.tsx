import ScoreGauge from "@/components/ScoreGauge";

const comparisons = [
  ["Your Practice", 84, "bg-blue-600"],
  ["Top Practices", 92, "bg-green-600"],
  ["Industry Average", 59, "bg-slate-400"],
];

const opportunities = [
  ["Patient Trust", "Strong"],
  ["Local Visibility", "Needs attention"],
  ["Mobile Experience", "High impact"],
  ["Appointment Conversion", "Opportunity"],
];

export default function HomeReportPreview() {
  return (
    <div className="relative rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-blue-100">
      <div className="absolute -right-4 -top-4 rounded-full bg-green-600 px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg">
        Sample Report
      </div>

      <div className="rounded-3xl bg-slate-950 p-6 text-white">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-300">
          Live Patient Growth Report Preview
        </p>

        <h2 className="mt-4 text-3xl font-black tracking-tight">
          Your website audit, translated into growth opportunities.
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          See how your practice compares, what is helping you, and what may be
          costing you new patients.
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[180px_1fr]">
        <ScoreGauge score={84} />

        <div className="rounded-3xl bg-slate-50 p-5">
          <h3 className="font-bold text-slate-950">How You Compare</h3>

          <div className="mt-5 space-y-4">
            {comparisons.map(([label, value, color]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm font-medium">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {opportunities.map(([title, status]) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <p className="text-sm font-bold text-slate-950">{title}</p>
            <p className="mt-1 text-sm text-slate-600">{status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
