import AuditFixLogo from "@/components/AuditFixLogo";
import AuditForm from "@/components/AuditForm";
import HomeReportPreview from "@/components/home/HomeReportPreview";

const metrics = [
  [
    "50+",
    "Signals Reviewed",
    "Patient trust, SEO, speed, mobile, and conversion checks.",
  ],
  [
    "2 min",
    "Average Scan",
    "Fast enough for a practice owner to use between appointments.",
  ],
  ["100%", "Free Report", "No signup required to see the first results."],
  [
    "AI",
    "Clear Insights",
    "Technical findings translated into growth opportunities.",
  ],
];

const features = [
  [
    "✓",
    "Patient Trust",
    "Reviews signals that help patients feel confident choosing your practice.",
  ],
  [
    "📍",
    "Local SEO",
    "Checks whether your homepage supports nearby dental search visibility.",
  ],
  [
    "⚡",
    "Performance",
    "Finds speed issues that may cause mobile visitors to leave.",
  ],
  [
    "📱",
    "Mobile Experience",
    "Looks at how easily patients can call, book, or find your office.",
  ],
  [
    "♿",
    "Accessibility",
    "Highlights usability issues that may create friction for visitors.",
  ],
  ["🛡", "Security", "Checks basic trust and safety signals like HTTPS."],
];

const steps = [
  [
    "1",
    "Enter your website",
    "Paste your dental practice homepage URL.",
  ],
  [
    "2",
    "AuditFix scans it",
    "We review patient conversion, local visibility, trust, mobile, SEO, and speed signals.",
  ],
  [
    "3",
    "Receive your report",
    "Get a professional Patient Growth Report with clear next steps.",
  ],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-blue-50 via-white to-white" />
        <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-green-100/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-12 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <AuditFixLogo size="md" />

            <div className="mt-12">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-700">
                Free Dental Website Audit
              </p>

              <h1 className="mt-5 max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
                Know exactly why your website may be losing patients.
              </h1>

              <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">
                Get a professional Patient Growth Report that reveals
                opportunities to increase appointment requests, patient trust,
                local visibility, and mobile conversions.
              </p>
            </div>

            <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-blue-100/70">
              <AuditForm />
            </div>

            <p className="mt-4 text-sm text-slate-500">
              No signup required. Email and PDF options are available after the
              audit.
            </p>
          </div>

          <HomeReportPreview />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(([value, title, text]) => (
            <article
              key={title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <p className="text-4xl font-black text-blue-700">{value}</p>
              <h3 className="mt-3 font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-700">
              How It Works
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">
              A professional audit in under two minutes.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 lg:col-span-2">
            {steps.map(([step, title, text]) => (
              <article
                key={step}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-lg font-black text-white">
                  {step}
                </div>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-700">
              What We Analyze
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">
              Not just website scores — patient growth opportunities.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              AuditFix translates technical website issues into clear business
              insights a dental practice can actually use.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([icon, title, text]) => (
              <article
                key={title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  {icon}
                </div>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <AuditFixLogo size="sm" variant="white" />

            <h2 className="mt-8 text-4xl font-black tracking-tight">
              Ready to discover what is holding your website back?
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Run a free homepage-level audit and get clear opportunities to
              improve patient trust, local visibility, and appointment requests.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-4 text-slate-950 shadow-xl">
            <AuditForm />
          </div>
        </div>
      </section>
    </main>
  );
}
