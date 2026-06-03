import { NextResponse } from "next/server";

async function getPageSpeedResult(url: string) {
  const apiKey = process.env.PAGESPEED_API_KEY;

  const apiUrl = new URL(
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
  );

  apiUrl.searchParams.set("url", url);
  apiUrl.searchParams.set("strategy", "mobile");
  apiUrl.searchParams.append("category", "PERFORMANCE");
  apiUrl.searchParams.append("category", "ACCESSIBILITY");
  apiUrl.searchParams.append("category", "SEO");
  apiUrl.searchParams.append("category", "BEST_PRACTICES");

  if (apiKey) {
    apiUrl.searchParams.set("key", apiKey);
  }

  const response = await fetch(apiUrl.toString());

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `PageSpeed failed. Status: ${response.status}. Details: ${errorText}`,
    );
  }

  return response.json();
}

function scoreFromCategory(data: any, category: string) {
  const score = data?.lighthouseResult?.categories?.[category]?.score;

  if (typeof score !== "number") {
    return null;
  }

  return Math.round(score * 100);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const websiteUrl = body.websiteUrl;

    if (!websiteUrl || typeof websiteUrl !== "string") {
      return NextResponse.json(
        { error: "Website URL is required." },
        { status: 400 },
      );
    }

    const normalizedUrl = websiteUrl.startsWith("http")
      ? websiteUrl
      : `https://${websiteUrl}`;

    const mobileResult = await getPageSpeedResult(normalizedUrl);

    return NextResponse.json({
      websiteUrl: normalizedUrl,
      scores: {
        mobilePerformance: scoreFromCategory(mobileResult, "performance"),
        desktopPerformance: null,
        accessibility: scoreFromCategory(mobileResult, "accessibility"),
        seo: scoreFromCategory(mobileResult, "seo"),
        bestPractices: scoreFromCategory(mobileResult, "best-practices"),
      },
      scanStatus: {
        mobile: "completed",
        desktop: "not_run_in_free_scan",
      },
    });
  } catch (error) {
    console.error("Audit API Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "We could not complete the scan. Please try again.",
      },
      { status: 500 },
    );
  }
}