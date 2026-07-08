export const BRAND = {
  // Company
  name: "AuditFix",
  shortName: "AuditFix",

  // Marketing
  tagline: "Helping dental practices turn website visitors into patients.",
  description:
    "AuditFix helps dental practices identify website issues that impact patient trust, local visibility, appointment conversions, and overall online growth.",

  // URLs
  website: "https://dentist.auditfix.ai",
  supportEmail: "support@auditfix.ai",

  // Report titles
  quickReportTitle: "Patient Growth Quick Report",
  deepReportTitle: "Patient Growth Deep Report",

  // Branding
  colors: {
    primary: "#2563EB",
    primaryLight: "#EFF6FF",
    success: "#16A34A",
    warning: "#D97706",
    danger: "#DC2626",
    dark: "#0F172A",
    gray: "#64748B",
    border: "#E2E8F0",
    background: "#F8FAFC",
  },

  // Score labels
  scores: {
    excellent: 90,
    strong: 75,
    needsAttention: 60,
  },
} as const;
