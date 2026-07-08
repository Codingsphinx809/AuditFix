import { BRAND } from "@/lib/brand";
import LogoMark from "@/components/LogoMark";

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
    <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-2xl font-black text-white shadow-sm">
          A
        </div>

        <div>
          <p className="text-2xl font-black tracking-tight text-slate-950">
            {BRAND.name}
          </p>

          <p className="mt-1 max-w-2xl text-sm font-medium text-slate-600">
            {BRAND.tagline}
          </p>
        </div>
      </div>

      {(eyebrow || title || subtitle) && (
        <div className="mt-8 border-t border-slate-200 pt-6">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              {eyebrow}
            </p>
          )}

          {title && (
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </header>
  );
}
