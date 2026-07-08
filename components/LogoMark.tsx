type LogoMarkProps = {
  size?: "sm" | "md" | "lg";
};

export default function LogoMark({ size = "md" }: LogoMarkProps) {
  const sizes = {
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-20 w-20",
  };

  return (
    <div className={`relative ${sizes[size]}`} aria-label="AuditFix logo mark">
      <div className="absolute inset-0 flex items-center justify-center text-[3rem] font-black leading-none text-blue-700">
        A
      </div>

      <div className="absolute bottom-1 left-1/2 h-3 w-7 -translate-x-1/2 rotate-[-18deg] rounded-full bg-green-600" />
      <div className="absolute bottom-3 left-[42%] h-3 w-10 rotate-[-42deg] rounded-full bg-green-600" />
    </div>
  );
}
