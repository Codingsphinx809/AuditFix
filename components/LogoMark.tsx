import { BRAND } from "@/lib/brand";

type AuditFixLogoProps = {
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function AuditFixLogo({
  showTagline = true,
  size = "md",
}: AuditFixLogoProps) {
  const markSize = {
    sm: "h-10 w-14",
    md: "h-14 w-20",
    lg: "h-20 w-28",
  };

  const wordSize = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`relative shrink-0 ${markSize[size]}`}>
        <div className="absolute left-0 top-0 text-[3.9rem] font-black leading-none tracking-tighter text-blue-700">
          A
        </div>

        <div className="absolute bottom-3 left-5 h-2.5 w-9 -rotate-45 rounded-full bg-green-600" />
        <div className="absolute bottom-4 left-2 h-2.5 w-6 rotate-45 rounded-full bg-green-600" />
      </div>

      <div>
        <div className={`font-black tracking-tight leading-none text-slate-950 ${wordSize[size]}`}>
          Audit<span className="text-blue-700">Fix</span>
        </div>

        {showTagline && (
          <p className="mt-2 max-w-xl text-base leading-6 text-slate-600">
            {BRAND.tagline}
          </p>
        )}
      </div>
    </div>
  );
}
