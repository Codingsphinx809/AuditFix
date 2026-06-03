export type AuditScores = {
  mobilePerformance: number | null;
  desktopPerformance: number | null;
  accessibility: number | null;
  seo: number | null;
  bestPractices: number | null;
};

export type AuditInsight = {
  title: string;
  impact: "High" | "Medium" | "Low";
  message: string;
};

export function generateInsights(
  scores: AuditScores,
): AuditInsight[] {
  const insights: AuditInsight[] = [];

  if (
    scores.mobilePerformance !== null &&
    scores.mobilePerformance < 60
  ) {
    insights.push({
      title: "Mobile Experience",
      impact: "High",
      message:
        "Many prospective patients search for dental services from their phones. Slow mobile performance may reduce appointment requests and increase abandonment.",
    });
  }

  if (
    scores.seo !== null &&
    scores.seo < 80
  ) {
    insights.push({
      title: "Local Visibility",
      impact: "High",
      message:
        "Your practice may be missing opportunities to appear in local search results, making it harder for nearby patients to discover your services.",
    });
  }

  if (
    scores.accessibility !== null &&
    scores.accessibility < 85
  ) {
    insights.push({
      title: "Accessibility",
      impact: "Medium",
      message:
        "Some visitors may experience difficulty using your website, which can negatively affect trust and engagement.",
    });
  }

  if (
    scores.bestPractices !== null &&
    scores.bestPractices < 85
  ) {
    insights.push({
      title: "Technical Health",
      impact: "Medium",
      message:
        "Technical issues can reduce website reliability and may affect how patients perceive your practice online.",
    });
  }

  if (
    scores.desktopPerformance !== null &&
    scores.desktopPerformance < 60
  ) {
    insights.push({
      title: "Desktop Performance",
      impact: "Low",
      message:
        "Some users may experience slower loading times on desktop devices, potentially impacting engagement.",
    });
  }

  return insights;
}