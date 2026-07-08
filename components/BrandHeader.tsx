import AuditFixLogo from "@/components/AuditFixLogo";

type BrandHeaderProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

export default function BrandHeader({
  eyebrow,
  title,
  subtitle,
}: BrandHeaderProps) {
  return (
    <header className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
      <AuditFixLogo size="md" />

      {(eyebrow || title || subtitle) && (
        <div className="mt-10 border-t border-slate-200 pt-8">
          {eyebrow && (
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              {eyebrow}
            </p>
          )}

          {title && (
            <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-950">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="mt-4 max-w-4xl text-xl leading-8 text-slate-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </header>
  );
}
