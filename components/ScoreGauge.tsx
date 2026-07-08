type ScoreGaugeProps = {
  score: number;
  label?: string;
};

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-700";
  if (score >= 75) return "text-blue-700";
  if (score >= 60) return "text-amber-700";
  return "text-red-700";
}

function getRingColor(score: number) {
  if (score >= 90) return "stroke-green-600";
  if (score >= 75) return "stroke-blue-600";
  if (score >= 60) return "stroke-amber-600";
  return "stroke-red-600";
}

export default function ScoreGauge({
  score,
  label = "Patient Growth Score",
}: ScoreGaugeProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(score, 100));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="relative h-36 w-36">
        <svg className="h-36 w-36 -rotate-90" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            strokeWidth="12"
            className="stroke-slate-100"
          />

          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={getRingColor(score)}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-black ${getScoreColor(score)}`}>
            {score}
          </span>
          <span className="text-xs font-semibold text-slate-500">/100</span>
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-slate-950">
        {label}
      </p>
    </div>
  );
}
