import AuditForm from "@/components/AuditForm";
import BrandHeader from "@/components/BrandHeader";
import ScoreGauge from "@/components/ScoreGauge";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <BrandHeader
            eyebrow="Free Dental Website Audit"
            title="Helping dental practices turn website visitors into patients."
            subtitle="AuditFix analyzes your website for patient trust, local visibility, appointment conversion, website performance, accessibility, and SEO in under two minutes."
          />

          <div className="mt-10">
            <AuditForm />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            No signup required to see your results. Email and PDF options are
            available after the audit.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                Example Result
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Patient Growth Score
              </h2>
              <p className="mt-2 text-slate-600">
                A sample preview of the insights your report will include.
              </p>
            </div>

            <ScoreGauge score={68} />
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl bg-green-50 p-5">
              <h3 className="font-bold text-green-900">
                What&apos;s helping you
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-green-800">
                <li>✓ Secure HTTPS website</li>
                <li>✓ Contact page is available</li>
                <li>✓ Location information detected</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-red-50 p-5">
              <h3 className="font-bold text-red-900">
                What may be costing you patients
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-red-800">
                <li>✕ Appointment button may be hard to find</li>
                <li>✕ Mobile speed may reduce patient inquiries</li>
                <li>✕ Missing local trust signals</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              What your free audit reveals
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Not just website scores — patient growth opportunities.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              AuditFix translates technical website issues into clear business
              insights a dental practice can actually use.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[
              [
                "🦷",
                "Patient Growth Score",
                "A simple score showing how ready your site is to attract and convert patients.",
              ],
              [
                "📍",
                "Local Visibility",
                "Checks whether your homepage supports local dental search discovery.",
              ],
              [
                "⭐",
                "Trust & Credibility",
                "Reviews signals that help patients feel confident choosing your practice.",
              ],
              [
                "📱",
                "Mobile Experience",
                "Looks at how easy it is for mobile visitors to call, book, or find you.",
              ],
              [
                "⚡",
                "Technical Health",
                "Uses real performance and accessibility data to find hidden blockers.",
              ],
            ].map(([icon, title, text]) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="text-3xl" aria-hidden="true">
                  {icon}
                </div>
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-black">
              A useful audit in under two minutes.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 lg:col-span-2">
            {[
              [
                "1",
                "Enter your website",
                "Paste your dental practice homepage URL.",
              ],
              [
                "2",
                "AuditFix analyzes it",
                "We review patient conversion, visibility, trust, mobile, and speed signals.",
              ],
              [
                "3",
                "Get your action plan",
                "See what’s working, what may be hurting you, and what to fix first.",
              ],
            ].map(([step, title, text]) => (
              <article
                key={step}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 font-bold text-white">
                  {step}
                </div>
                <h3 className="mt-5 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Find out where your website may be losing patients.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Start with a free homepage-level audit. No pressure, no spam, just
            clear opportunities to improve.
          </p>
        </div>
      </section>
    </main>
  );
}
