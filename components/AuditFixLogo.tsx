import Image from "next/image";

type AuditFixLogoProps = {
  size?: "sm" | "md" | "lg";
};

export default function AuditFixLogo({ size = "md" }: AuditFixLogoProps) {
  const sizes = {
    sm: { width: 220, height: 91 },
    md: { width: 340, height: 140 },
    lg: { width: 460, height: 190 },
  };

  return (
    <Image
      src="/logo.png"
      alt="AuditFix - Helping dental practices turn website visitors into patients."
      width={sizes[size].width}
      height={sizes[size].height}
      priority
    />
  );
}
