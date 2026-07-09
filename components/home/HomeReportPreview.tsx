import ScoreGauge from "@/components/ScoreGauge";

export default function HomeReportPreview() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-blue-100">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700">
            Live Patient Growth Report Preview
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">
            Your website audit, translated into growth opportunities.
          </h2>
        </div>

        <ScoreGauge score={84} />
      </div>

      <div className="mt-8 rounded-3xl bg-slate-50 p-5">
        <h3 className="font-bold text-slate-950">How You Compare</h3>

        <div className="mt-5 space-y-4">
          {[
            ["Your Practice", 84, "bg-blue-600"],
            ["Top Practices", 92, "bg-green-600"],
            ["Industry Average", 59, "bg-slate-400"],
          ].map(([label, value, color]) => (
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          ["More Visitors", "Attract the right patients"],
          ["More Bookings", "Convert visitors into appointments"],
          ["More Growth", "Strengthen your practice"],
          ["More Trust", "Build patient confidence"],
        ].map(([title, text]) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <p className="font-bold text-slate-950">{title}</p>
            <p className="mt-1 text-sm text-slate-600">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
