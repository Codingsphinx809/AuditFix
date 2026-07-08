type LogoMarkProps = {
  size?: "sm" | "md" | "lg";
};

export default function LogoMark({ size = "md" }: LogoMarkProps) {
  const sizeClasses = {
    sm: "h-10 w-10 text-lg",
    md: "h-14 w-14 text-2xl",
    lg: "h-20 w-20 text-4xl",
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl bg-blue-700 font-black text-white shadow-sm ${sizeClasses[size]}`}
      aria-label="AuditFix logo"
    >
      <span>A</span>

      <span className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-sm font-black text-white ring-4 ring-white">
        ✓
      </span>
    </div>
  );
}
