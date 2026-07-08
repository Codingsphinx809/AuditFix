import Image from "next/image";

type AuditFixLogoProps = {
  size?: "sm" | "md" | "lg";
};

export default function AuditFixLogo({
  size = "md",
}: AuditFixLogoProps) {
  const sizes = {
    sm: {
      width: 220,
      height: 74,
    },
    md: {
      width: 360,
      height: 120,
    },
    lg: {
      width: 520,
      height: 174,
    },
  };

  return (
    <Image
      src="/AuditFixLogo.png"
      alt="AuditFix"
      width={sizes[size].width}
      height={sizes[size].height}
      priority
      className="h-auto w-auto"
    />
  );
}
