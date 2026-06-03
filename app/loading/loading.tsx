export default function LoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-950">
          Analyzing your website...
        </h1>

        <p className="mt-3 text-slate-600">
          We're reviewing the factors that may impact patient growth.
        </p>

        <div className="mt-8 space-y-4">
          {[
            "Checking patient conversion signals",
            "Reviewing local visibility",
            "Measuring mobile experience",
            "Evaluating trust indicators",
            "Building your patient growth score",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-slate-200 p-4"
            >
              ✓ {item}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}