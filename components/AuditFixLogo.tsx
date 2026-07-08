import Image from "next/image";

type AuditFixLogoProps = {
  size?: "sm" | "md" | "lg";
};

export default function AuditFixLogo({ size = "md" }: AuditFixLogoProps) {
  const sizes = {
    sm: { width: 220, height: 70 },
    md: { width: 360, height: 115 },
    lg: { width: 520, height: 166 },
  };

  return (
    <Image
      src="/AuditFixLogo.png"
      alt="AuditFix - Helping dental practices turn website visitors into patients."
      width={sizes[size].width}
      height={sizes[size].height}
      priority
      className="h-auto"
    />
  );
}
